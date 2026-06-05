# 🤖 RoboLearn – Frontend

MERN stack website for a robotics education company.  
Tech: **React 18 · Vite · Tailwind CSS · Three.js · GSAP · React Router**

---

## 📁 Project Structure

```
robolearn/
├── index.html                    # HTML entry point (Google Fonts loaded here)
├── vite.config.js                # Vite config
├── tailwind.config.js            # Tailwind theme (custom colors, fonts, keyframes)
├── postcss.config.js             # PostCSS (Tailwind + Autoprefixer)
├── package.json
└── src/
    ├── main.jsx                  # React root, BrowserRouter
    ├── App.jsx                   # Route structure + loading gate
    ├── styles/
    │   └── index.css             # Tailwind directives + custom CSS
    └── components/
        └── LoadingScreen.jsx     # 3D robot loading screen (Three.js + GSAP)
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:5173
```

---

## 🎨 Custom Tailwind Tokens

| Token              | Value     | Usage                     |
|--------------------|-----------|---------------------------|
| `bg-bg`            | `#020408` | Page background           |
| `bg-surface`       | `#050d16` | Cards / panels            |
| `text-cyan`        | `#00f5ff` | Primary accent            |
| `text-orange`      | `#ff6b00` | Secondary accent          |
| `text-dim`         | `#334a5e` | Muted labels              |
| `font-orbitron`    | Orbitron  | Headings / display        |
| `font-rajdhani`    | Rajdhani  | Body / labels             |
| `animate-pulse2`   | —         | Badge dot pulse           |
| `animate-scanFlicker` | —      | CRT scanline flicker      |
| `animate-float`    | —         | Gentle float animation    |

---

## 🗂️ Pages Planned

| Route        | Component        | Status        |
|--------------|------------------|---------------|
| `/`          | Home             | 🔜 Next       |
| `/robots`    | Robots           | 🔜 Planned    |
| `/training`  | Training         | 🔜 Planned    |
| `/events`    | Events           | 🔜 Planned    |
| `/book`      | Book a Workshop  | 🔜 Planned    |

---

## 🔌 LoadingScreen API

```jsx
<LoadingScreen onComplete={() => setLoaded(true)} />
```

| Prop         | Type       | Description                         |
|--------------|------------|-------------------------------------|
| `onComplete` | `function` | Called when loading animation ends  |

---

## 📦 Key Dependencies

```json
{
  "three":            "^0.160.0",   // 3D robot scene
  "gsap":             "^3.12.2",    // Animations & timeline
  "react-router-dom": "^6.22.0",   // Client-side routing
  "tailwindcss":      "^3.4.1"     // Utility-first CSS
}
```
