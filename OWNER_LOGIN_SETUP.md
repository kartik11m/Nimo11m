# Owner Login - Simplified Setup

## How It Works Now

**No more signup page!** The owner account is automatically created when the backend starts.

### Step 1: Configure Owner Credentials (Backend)

Edit `.env` file in the backend folder:

```env
# Owner credentials - created automatically on first run
OWNER_EMAIL=owner@robolearn.com
OWNER_PASSWORD=ChangeMe@1234
```

**Change these to your desired credentials!**

### Step 2: Start Backend

```bash
cd backend
npm run dev
```

**First time startup output:**
```
✅ Owner account created successfully!
📧 Email: owner@robolearn.com
🔑 Password: (set in OWNER_PASSWORD env variable)
⚠️  Change these credentials after first login!
```

Next time you start, it will detect the owner already exists:
```
✅ Owner account already exists: owner@robolearn.com
```

### Step 3: Start Frontend

```bash
npm run dev
```

### Step 4: Login

1. Go to http://localhost:5173
2. Click **"Owner Login"** button (orange, top right)
3. Enter your configured credentials:
   - Email: `owner@robolearn.com`
   - Password: `ChangeMe@1234`
4. Click **Login** ✅

---

## Security Notes

- ⚠️ **Change the default credentials** in `.env` immediately
- ✅ Passwords are hashed with bcryptjs
- ✅ No signup page (prevents unauthorized registration)
- ✅ Token expires after 7 days
- ✅ Only owner can edit content

---

## What Changed

| Before | After |
|--------|-------|
| Anyone could sign up as owner | Owner account auto-created via .env |
| Registration page visible | Only login page |
| Insecure | Secure - no open registration |

---

## Example Credentials

**Development:**
```env
OWNER_EMAIL=owner@robolearn.com
OWNER_PASSWORD=ChangeMe@1234
```

**Production:**
```env
OWNER_EMAIL=your-real-email@example.com
OWNER_PASSWORD=SecureRandomPassword123!@#
```

---

## Troubleshooting

### "Invalid email or password"
- Check your `.env` file has correct credentials
- Make sure you copied the exact email and password
- Backend must be running and have created the owner account

### "Owner account not created"
- Check backend logs for initialization errors
- Make sure MongoDB connection works
- Verify `.env` has OWNER_EMAIL and OWNER_PASSWORD

### "Connection refused"
- Backend not running? Start it with `npm run dev`
- Wrong port? Check `PORT=5000` in `.env`

---

## Changing Password Later

To change the password after login, update the `.env` file and restart the backend:

1. Edit `backend/.env` with new `OWNER_PASSWORD`
2. The owner account will be updated on next backend restart
3. Login with new password

---

✅ **Now only you (the owner) can edit content. Much more secure!** 🔐
