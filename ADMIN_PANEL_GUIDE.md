# Admin Dashboard Setup for Frontend

The admin panel is now integrated into your website! Here's how to use it:

## Access the Admin Panel

1. **Login Page**: `http://localhost:5173/admin/login`
2. **Register Page**: `http://localhost:5173/admin/register` (First time only)

## Admin Dashboard Features

### 1. Dashboard (`/admin/dashboard`)
- Overview of total posts, published posts, and users
- Quick action buttons for common tasks
- System status indicators

### 2. Blog Posts Management (`/admin/posts`)
- View all blog posts with filters (All, Published, Draft)
- Create new blog posts
- Edit existing posts
- Delete posts
- Status indicator (Published/Draft)

### 3. Users Management (`/admin/users`)
- View all system users
- Change user roles (Student, Instructor, Admin)
- Delete users
- View user statistics

### 4. Sidebar Navigation
- Dashboard
- Blog Posts
- Users
- Settings (coming soon)
- User info and logout

## Setup Instructions

### Step 1: Create Admin Account

Navigate to `http://localhost:5173/admin/register` and fill in:
- Full Name: Your name
- Email: Your email
- Password: Strong password
- Confirm Password: Same password

### Step 2: Login

Go to `http://localhost:5173/admin/login` and enter your credentials

### Step 3: Start Managing Content

Once logged in, you can:
- Create new blog posts
- Edit and delete existing posts
- Manage user accounts and roles
- View dashboard statistics

## API Configuration

The admin panel communicates with the backend API. Make sure:

1. **Backend is running**: `npm run dev` from the `backend` folder
2. **Environment file**: Create a `.env` file in the frontend root if needed:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Design Theme

The admin panel matches your website theme:
- Dark background (#020203)
- Orange accent color (#FF6B35)
- Cyan highlights (#00F5FF)
- Purple accents (#A855F7)
- Same fonts: Bebas Neue, Syne, DM Sans
- Smooth animations and hover effects

## Security Features

✅ JWT Token Authentication  
✅ Protected Routes (ProtectedRoute component)  
✅ Automatic Token Storage in localStorage  
✅ Role-Based Access Control  
✅ Automatic Logout on Token Expiry  

## Components Used

- **AuthProvider**: Manages authentication state
- **ProtectedRoute**: Protects admin pages from unauthorized access
- **AdminLayout**: Main layout with sidebar navigation
- **AdminSidebar**: Navigation sidebar
- **Admin Pages**: Dashboard, Posts, Users management

## File Structure

```
src/admin/
├── components/
│   ├── AdminLayout.jsx          # Main layout wrapper
│   ├── AdminSidebar.jsx         # Navigation sidebar
│   └── ProtectedRoute.jsx       # Route protection
├── pages/
│   ├── AdminLoginPage.jsx       # Login page
│   ├── AdminRegisterPage.jsx    # Register page
│   ├── AdminDashboardPage.jsx   # Dashboard
│   ├── AdminPostsPage.jsx       # Posts management
│   └── AdminUsersPage.jsx       # Users management
└── utils/
    ├── api.js                   # API utility functions
    └── AuthContext.js           # Auth state management
```

## Next Steps

1. ✅ Basic admin setup
2. ⏳ Create Post page with editor
3. ⏳ Edit Post page
4. ⏳ Settings page
5. ⏳ Advanced analytics
6. ⏳ File upload for images
7. ⏳ Activity logs viewer

## Troubleshooting

### "Cannot connect to API"
- Make sure backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify API URL in admin utils

### "Login not working"
- Make sure you registered first
- Check your email and password
- Look at browser network tab for error details

### "Pages not loading"
- Clear localStorage and login again
- Check if token is expired
- Verify protected routes are working

---

**Ready to manage your website? Navigate to `/admin/login` now!** 🚀
