# Quick Implementation Guide

## Making Your Homepage Editable in 5 Minutes

### Step 1: Import EditableText Component

In any component (e.g., `Home.jsx`), add this import at the top:

```jsx
import EditableText from '../components/EditableText'
```

### Step 2: Wrap Your Text Content

Replace regular text with the `EditableText` component:

```jsx
// BEFORE (not editable):
<h1>Welcome to Nimo Labs</h1>
<p>Learn robotics and coding</p>

// AFTER (editable by owner):
<h1>
  <EditableText contentId="home.hero.title">
    Welcome to Nimo Labs
  </EditableText>
</h1>

<p>
  <EditableText contentId="home.hero.subtitle">
    Learn robotics and coding
  </EditableText>
</p>
```

### Step 3: That's It! 

When the owner logs in and clicks the text, they can edit it inline.

---

## Key Rules

1. **Each `contentId` must be unique** across your entire site
2. **Use dot notation** for organization: `page.section.element`
3. **Only wrap text, not HTML** - keep it simple:
   ```jsx
   ✅ <EditableText contentId="id">Just text</EditableText>
   ❌ <EditableText contentId="id"><strong>Bold text</strong></EditableText>
   ```

4. **Works with any HTML element:**
   ```jsx
   <h1><EditableText contentId="title">Title</EditableText></h1>
   <p><EditableText contentId="desc">Description</EditableText></p>
   <button><EditableText contentId="btn">Click Me</EditableText></button>
   <span><EditableText contentId="label">Label</EditableText></span>
   ```

---

## Content ID Naming Convention

Use this pattern: `page.section.type`

### Examples:
- `home.hero.title` - Hero section title on home page
- `home.hero.subtitle` - Hero section subtitle
- `home.features.heading` - Features section heading
- `about.intro.title` - About page intro title
- `training.course1.name` - Training course 1 name
- `robots.r1.description` - Robot 1 description

---

## Testing the System

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 2. Register Owner Account

1. Open http://localhost:5173
2. Click **"Owner Login"** button (orange, top right)
3. Click **"Sign Up"** link
4. Enter your details and register

### 3. Test Editing

1. Go back to http://localhost:5173 (home page)
2. You should see **"Logout"** button instead of "Owner Login"
3. Click on any `<EditableText>` content
4. Edit the text and click "Save"
5. Page reloads and shows your new content ✅

---

## Example: Making HeroSection Editable

**File: `src/components/HeroSection.jsx`**

```jsx
import EditableText from './EditableText'

export default function HeroSection() {
  return (
    <section className="hero">
      <h1>
        <EditableText contentId="hero.main.title">
          Welcome to Nimo Labs
        </EditableText>
      </h1>
      
      <p>
        <EditableText contentId="hero.main.subtitle">
          Learn Robotics & Coding
        </EditableText>
      </p>

      <p>
        <EditableText contentId="hero.main.description">
          Build amazing robots and develop your coding skills
        </EditableText>
      </p>

      <button>
        <EditableText contentId="hero.main.cta">
          Get Started
        </EditableText>
      </button>
    </section>
  )
}
```

---

## Styling When Editing

When owner hovers over editable text, it shows a subtle background change. You can customize this in `EditableText.jsx`:

```jsx
className={`${isOwner ? 'cursor-pointer hover:bg-white/5 px-1 rounded transition-colors' : ''}`}
```

Change `hover:bg-white/5` to any color you like:
- `hover:bg-[#FF6B35]/10` - Orange tint
- `hover:bg-[#00F5FF]/10` - Cyan tint
- `hover:bg-[#A855F7]/10` - Purple tint

---

## FAQ

**Q: Will editing break my layout?**  
A: No, the EditableText component is inline and doesn't change layout. Just make sure you only wrap text, not the container.

**Q: Can I edit the same contentId twice?**  
A: You shouldn't. Each contentId should be unique. But if you do, they'll all update together.

**Q: What if I want to edit longer content (paragraphs)?**  
A: For now, this is single-line editing. For rich text editing (multi-line, formatting), we can add a rich text editor later.

**Q: Can users see I'm editing?**  
A: Only you (the owner) see the edit mode. Regular visitors just see the text normally.

**Q: Can I undo changes?**  
A: Changes are saved to the database immediately. You need to manually edit them back.

---

## Next Steps

1. ✅ Start backend and frontend
2. ✅ Register owner account
3. ✅ Wrap content sections with `<EditableText>`
4. ✅ Test editing
5. ✅ Deploy when ready

You're all set! 🚀
