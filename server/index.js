
require("dotenv").config();

// Check environment variables
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
}

// DNS workaround for MongoDB Atlas connection
require("dns").setServers(["8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

const User = require("./models/User");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI;

// --------------------
// GENERAL MIDDLEWARE
// --------------------

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// --------------------
// USER REGISTRATION API
// --------------------

app.post("/register", async (req, res) => {
    try {
        const { name, password } = req.body;

        const email =
            typeof req.body.email === "string"
                ? req.body.email.trim().toLowerCase()
                : "";

        if (
            typeof name !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Check whether email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name: name.trim(),
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {
        console.error("Registration error:", error);

        // Handle duplicate email index errors
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            message: "Server error during registration"
        });
    }
});


// --------------------
// USER LOGIN API
// --------------------

app.post("/login", async (req, res) => {
    try {
        const { password } = req.body;

        const email =
            typeof req.body.email === "string"
                ? req.body.email.trim().toLowerCase()
                : "";

        // Validate input
        if (
            !email ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with stored hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Send successful login response
        return res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error during login"
        });
    }
});


// --------------------
// MULTER CONFIGURATION
// --------------------

// Configure image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"));
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${path.basename(file.originalname)}`;

        cb(null, uniqueName);
    }
});

// Configure upload validation
const upload = multer({
    storage: storage,

    // Maximum image size: 5 MB
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    // Allow image files only
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});


// --------------------
// BLOG POST SCHEMA
// --------------------

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    image: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model("Post", postSchema);


// --------------------
// GET ALL BLOG POSTS
// --------------------

app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });

        return res.status(200).json(posts);

    } catch (error) {
        console.error("Get posts error:", error);

        return res.status(500).json({
            message: "Failed to fetch posts"
        });
    }
});


// --------------------
// CREATE BLOG POST
// --------------------

app.post("/posts", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const { title, content } = req.body;

        if (
            typeof title !== "string" ||
            typeof content !== "string" ||
            !title.trim() ||
            !content.trim()
        ) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const image = req.file ? req.file.filename : null;

        const newPost = new Post({
            title: title.trim(),
            content: content.trim(),

            // Get author from authenticated user
            author: req.user.name,

            // Store the user's MongoDB ID
            user: req.user._id,

            image
        });

        await newPost.save();

        return res.status(201).json(newPost);

    } catch (error) {
        console.error("Create post error:", error);

        return res.status(500).json({
            message: "Failed to create post"
        });
    }
});


// --------------------
// UPDATE BLOG POST
// --------------------

app.put("/posts/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;

        const updates = {};

        if (typeof title === "string") {
            updates.title = title.trim();
        }

        if (typeof content === "string") {
            updates.content = content.trim();
        }

        const updatedPost = await Post.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            {
                $set: updates
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPost) {
            return res.status(404).json({
                message: "Post not found or you are not authorized to edit it"
            });
        }

        return res.status(200).json(updatedPost);

    } catch (error) {
        console.error("Update post error:", error);

        return res.status(500).json({
            message: "Failed to update post"
        });
    }
});


// --------------------
// DELETE BLOG POST
// --------------------

app.delete("/posts/:id", authMiddleware, async (req, res) => {
    try {
        const deletedPost = await Post.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!deletedPost) {
            return res.status(404).json({
                message: "Post not found or you are not authorized to delete it"
            });
        }

        return res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("Delete post error:", error);

        return res.status(500).json({
            message: "Failed to delete post"
        });
    }
});


// --------------------
// MULTER ERROR HANDLER
// --------------------

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "Image size must not exceed 5 MB"
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }

    if (error.message === "Only image files are allowed") {
        return res.status(400).json({
            message: error.message
        });
    }

    console.error("Server error:", error);

    return res.status(500).json({
        message: "Something went wrong"
    });
});


// --------------------
// CONNECT DATABASE AND START SERVER
// --------------------

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB successfully!");

      app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });
