# Admin Panel Setup Guide

This directory contains the admin functionality for managing website content.

## Features

### 1. Admin Authentication
- **Register Admin**: `/api/admin/auth/register` (POST)
- **Login Admin**: `/api/admin/auth/login` (POST)
- **Logout**: `/api/admin/auth/logout` (POST) - Protected
- **Get Current Admin**: `/api/admin/auth/me` (GET) - Protected

### 2. Content Management
- **Create Post**: `/api/admin/content/posts` (POST)
- **Update Post**: `/api/admin/content/posts/:id` (PUT)
- **Delete Post**: `/api/admin/content/posts/:id` (DELETE)
- **Get All Posts**: `/api/admin/content/posts` (GET)

### 3. User Management (Admin Only)
- **Get All Users**: `/api/admin/users` (GET)
- **Update User**: `/api/admin/users/:id` (PUT)
- **Update User Role**: `/api/admin/users/:id/role` (PUT)
- **Delete User**: `/api/admin/users/:id` (DELETE)

## API Examples

### Register Admin
```bash
curl -X POST http://localhost:5000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@robolearn.com",
    "password": "SecurePassword123",
    "passwordConfirm": "SecurePassword123"
  }'
```

### Login Admin
```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@robolearn.com",
    "password": "SecurePassword123"
  }'
```

### Create Blog Post
```bash
curl -X POST http://localhost:5000/api/admin/content/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Getting Started with Robotics",
    "content": "A comprehensive guide to robotics...",
    "category": "tutorials",
    "excerpt": "Learn robotics basics",
    "image": "/images/robot.jpg",
    "tags": ["robotics", "beginners"],
    "featured": true,
    "published": true
  }'
```

### Update Blog Post
```bash
curl -X PUT http://localhost:5000/api/admin/content/posts/POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Title",
    "published": true
  }'
```

## Authentication

All admin routes (except register/login) require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security

✅ Password hashing with bcryptjs  
✅ JWT token authentication  
✅ Role-based access control (RBAC)  
✅ Activity logging  
✅ Input validation  
✅ Error handling  

## Next Steps

1. Create admin dashboard UI (React)
2. Add file upload for images
3. Add email notifications
4. Add dashboard analytics
5. Add activity audit logs
6. Add backup/restore functionality
7. Add permission management
