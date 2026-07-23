# Nimo Labs

Nimo Labs is a modern, interactive website for a robotics education company. It is designed to help students, parents, schools, and workshops discover robotics programs, explore training opportunities, book services, and learn about the brand through a polished digital experience.

## Why this website is useful

This project serves as a digital front door for a robotics education business. It helps visitors:

- explore robotics courses, training programs, and events
- learn about robots, competitions, achievements, and lab setup services
- contact the organization easily for enquiries or partnerships
- view a professional, engaging experience built for education and innovation
- manage content through an owner CMS experience for updates without needing technical help

In short, the website makes robotics education more accessible and presents the business in a modern, trustworthy, and inspiring way.

## Main features

- Responsive landing pages for home, about, training, events, and contact
- Dedicated pages for robots, competitions, achievements, and lab setup
- Interactive animations and visual effects for a futuristic experience
- Owner login and content management support for updating site content
- Media support for videos, images, and uploaded content
- Separate frontend and backend architecture for scalability

## Technologies used

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- GSAP for animations
- Three.js for 3D visual effects

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- CORS, Helmet, and dotenv for secure API setup

## Project structure

```bash
robolearn/
├── src/                 # React frontend source files
├── backend/             # Express + MongoDB backend
├── public/              # Static assets and media files
├── package.json         # Frontend dependencies and scripts
├── backend/package.json # Backend dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Getting started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Start the frontend development server

```bash
npm run dev
```

The app will open at:

```bash
http://localhost:5173
```

### 3. Start the backend server

```bash
cd backend
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

## Summary

Nimo Labs combines modern web design, interactive visuals, and a full-stack architecture to create a strong online presence for robotics education. It is useful because it helps organizations showcase their work, engage visitors, and manage content efficiently while delivering a memorable user experience.

