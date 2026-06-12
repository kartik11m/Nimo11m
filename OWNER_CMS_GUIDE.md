# Owner-Only Content Management System

## Overview

This is a **simplified, minimal** content management system where:
- **One owner** can log in and edit website content
- **Click-to-edit inline editing** on any text across the website
- **No separate admin panel** - editing happens directly on the pages
- **All changes are saved to the database** and persist across page reloads

---

## 🚀 Quick Start

### Backend Setup

1. **Create `.env` file in backend folder:**

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/robolearn
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

2. **Install dependencies:**
```bash
cd backend
npm install
```

3. **Start the backend:**
```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### Frontend Setup

1. **Backend must be running** before starting frontend

2. **Create `.env` file in frontend (optional):**
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start the frontend:**
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📝 Owner Login & Usage

### First Time Setup

1. Go to **Navbar** → Click **"Owner Login"** button (orange)
2. You'll be redirected to `/owner-login` page
3. Click the **"Sign Up" link** at the bottom
4. Fill in:
   - **Name**: Your full name
   - **Email**: Your email
   - **Password**: Strong password (min 6 characters)
   - **Confirm Password**: Same password

5. After registration, you'll be automatically logged in ✅

### Logging In (Next Times)

1. Go to **Navbar** → Click **"Owner Login"** button
2. Enter your email and password
3. Click **Login**
4. You'll be logged in for 7 days (token stored in browser)

---

## ✏️ How to Edit Content

### Making Content Editable

Wrap any text in the `<EditableText>` component:

```jsx
import EditableText from '../components/EditableText'

<h1>
  <EditableText contentId="home-hero-title">
    Welcome to Nimo Labs
  </EditableText>
</h1>
```

### How It Works (When Owner is Logged In)

1. **Hover over editable text** → Notice the background changes slightly
2. **Click on the text** → An edit box appears
3. **Type your new content** → Edit the text
4. **Click "Save"** → Changes are saved to database and page reloads
5. **Done!** → Your changes are now live

### If Not Logged In

- Editable text looks normal
- Clicking does nothing
- Text is read-only

---

## 🔧 API Endpoints

### Owner Authentication
```
POST   /api/owner/register        - Create owner account
POST   /api/owner/login           - Login (returns JWT token)
GET    /api/owner/me              - Get owner info (protected)
```

### Content Management
```
GET    /api/content               - Get all content (public)
GET    /api/content/:page         - Get content for specific page (public)
PUT    /api/content/:contentId    - Update content (protected - owner only)
```

---

## 🗄️ Database Models

### Owner Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### Content Model
```javascript
{
  _id: ObjectId,
  key: String (unique) - e.g., "home.hero.title"
  label: String - Human readable name
  type: String - 'text', 'paragraph', 'heading', 'richtext'
  content: String - The actual content
  page: String - Which page (e.g., "home", "about")
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📋 Implementation Checklist

### Step 1: Prepare Backend
- [ ] Create `.env` file with MongoDB URI and JWT_SECRET
- [ ] Run `npm install` in backend folder
- [ ] Run `npm run dev` to start backend

### Step 2: Prepare Frontend
- [ ] Verify backend is running
- [ ] Run `npm run dev` in frontend folder
- [ ] Check `/owner-login` page loads correctly

### Step 3: Register Owner Account
- [ ] Click "Owner Login" in navbar
- [ ] Sign up with your credentials
- [ ] Verify you're logged in (button should say "Logout")

### Step 4: Add Editable Content
- [ ] Wrap text elements with `<EditableText>` component
- [ ] Give each a unique `contentId`
- [ ] Test editing by clicking and changing text

### Step 5: Seed Sample Content
- [ ] Use MongoDB to add initial content documents
- [ ] Reference by correct `contentId` in components

---

## 🔐 Security Notes

✅ **Passwords are hashed** with bcryptjs  
✅ **JWT tokens** expire after 7 days  
✅ **Token stored in localStorage** (auto-included in API requests)  
✅ **Edit endpoints protected** - only owner can modify content  

⚠️ **For Production:**
- Change `JWT_SECRET` to a strong random string
- Use HTTPS only
- Set proper `CORS_ORIGIN`
- Secure MongoDB connection with strong credentials
- Consider adding rate limiting

---

## 🛠️ Troubleshooting

### "Cannot connect to API"
- [ ] Backend running? Check `http://localhost:5000/health`
- [ ] Check browser console for CORS errors
- [ ] Verify `VITE_API_URL` env variable

### "Login not working"
- [ ] Make sure you registered first
- [ ] Check email and password are correct
- [ ] Clear localStorage and try again

### "EditableText not showing edit mode"
- [ ] Are you logged in? Check navbar
- [ ] Is component wrapped correctly?
- [ ] Check `contentId` prop is provided

### "Changes not saving"
- [ ] Check network tab in dev tools
- [ ] Verify backend API is running
- [ ] Check MongoDB connection is working
- [ ] Look at backend console for errors

---

## 📚 File Structure

```
backend/src/
├── models/
│   ├── Owner.js          # Owner schema
│   └── Content.js        # Content schema
├── controllers/
│   ├── ownerController.js      # Auth logic
│   └── contentController.js    # Content CRUD
├── middleware/
│   └── ownerAuth.js      # JWT verification
└── routes/
    └── owner.js          # Owner routes

frontend/src/
├── context/
│   └── OwnerAuthContext.jsx   # Auth state management
├── components/
│   ├── Navbar.jsx        # Updated with login button
│   └── EditableText.jsx  # Inline edit component
├── pages/
│   └── OwnerLoginPage.jsx     # Login form
└── App.jsx               # Updated routing
```

---

## 🎯 Next Steps

1. **Register your owner account** at `/owner-login`
2. **Wrap existing content** with `<EditableText>` components
3. **Test editing** by clicking and changing text
4. **Deploy** to production when ready

---

## 💡 Tips

- Use meaningful `contentId` values (e.g., "home.hero.title")
- Label content clearly for future reference
- Save frequently to avoid losing changes
- Test on different pages before deploying
- Keep token safe (logout when done editing)

---

## ✨ That's it! 

Your website is now editable by the owner from the frontend. No separate admin panel needed! 🚀
