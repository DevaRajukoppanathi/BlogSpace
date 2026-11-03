# BlogSpace – MERN Stack Blogging Platform

BlogSpace is a full-stack blogging platform where users can register, log in, create blog posts, explore blogs published by others, and manage their own content.

The application is built using the MERN stack with JWT authentication and a responsive user interface.

## Features

- User registration and login
- Secure authentication using JWT
- Create and publish blog posts
- Edit and delete your own blog posts
- Explore blogs published by other users
- Search blogs by title, author, or content
- View detailed blog posts
- User profile with published blog count
- Upload images with blog posts
- Responsive design for desktop, tablet, and mobile

## Technologies Used

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer

## Project Structure

```text
BlogSpace/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── uploads/
│   ├── index.js
│   └── package.json
│
├── .gitignore
├── package.json
└── package-lock.json
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/DevaRajukoppanathi/BlogSpace.git
```

### 2. Install backend dependencies

```bash
cd BlogSpace/server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the placeholder values with your own configuration. Never upload your actual `.env` file to GitHub.

### 4. Start the backend

```bash
npm start
```

Backend runs at:

`http://localhost:5000`

### 5. Install frontend dependencies

Open another terminal:

```bash
cd BlogSpace/client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Authentication and Security

- Passwords are hashed using bcryptjs.
- JWT tokens are used for authentication.
- Protected routes require a valid authentication token.
- Users can edit or delete only their own blog posts.

## Future Improvements

- Deploy the application online
- Add comments and likes
- Add user profile editing
- Improve image storage and management

## Author

**Deva Raju Koppanathi**

GitHub:[ https://github.com/YOUR_USERNAME](https://github.com/DevaRajukoppanathi?tab=repositories)

---

⭐ If you find this project interesting, feel free to explore the repository!
