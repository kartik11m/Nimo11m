# Robolearn Backend API

Backend server for Robolearn website built with Node.js, Express.js, and MongoDB.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Project Structure

```
backend/
├── src/
│   ├── config/        # Database and environment configuration
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Custom middleware (auth, error handling, etc.)
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   └── server.js      # Main server file
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
```

### 3. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Routes

### Health Check
- `GET /health` - Server status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Contact
- `POST /api/contact` - Submit contact form

## Environment Variables

```env
PORT=5000
NODE_ENV=development

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/robolearn

# MongoDB Atlas (cloud)
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/robolearn

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Database Setup

### Local MongoDB

```bash
# Windows (with MongoDB installed)
mongod

# Or use MongoDB Atlas for cloud database
```

### Create First Admin User

Connect to MongoDB and insert a user:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "hashed_password",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Development Notes

- All routes are prefixed with `/api`
- Error handling is centralized in middleware
- JWT authentication can be added to protected routes
- CORS is configured for frontend at `http://localhost:5173`

## Next Steps

1. ✅ Basic server setup
2. ⏳ Add authentication endpoints
3. ⏳ Implement database models
4. ⏳ Add validation middleware
5. ⏳ Create controllers for business logic
6. ⏳ Add email notifications
7. ⏳ Add file upload handling
8. ⏳ Deploy to production

## License

MIT
