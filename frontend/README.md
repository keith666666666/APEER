# APEER Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Framer-Style UI with Glassmorphism & Fluid Animations**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Design System](#design-system)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Build & Deploy](#build--deploy)
- [Configuration](#configuration)
- [Component Library](#component-library)

---

## 🎯 Overview

The APEER frontend is a modern, responsive web application built with **React 18** and **Vite**, featuring a cutting-edge design system inspired by Linear and Framer. It provides an intuitive interface for students, teachers, and administrators to interact with the AI-powered evaluation system.

### Key Highlights

- 🎨 **Framer-Style Aesthetics** - Dark mode, glassmorphism, aurora gradients
- ⚡ **Lightning Fast** - Vite for instant HMR and optimized builds
- 🎭 **Fluid Animations** - Framer Motion with spring physics
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- 🔒 **Secure** - OAuth2 integration with role-based routing

---

## 🎨 Design System

### Color Palette

```javascript
// Midnight SaaS Theme
const colors = {
  // Backgrounds
  page: '#030712',           // Rich Black
  card: 'rgba(17, 24, 39, 0.6)', // Glassmorphism
  
  // Accents
  primary: '#00BFA5',        // Teal (Success, High Scores)
  secondary: '#7C3AED',      // Deep Purple (Active States)
  
  // Status Colors
  success: '#10B981',        // Green
  warning: '#F59E0B',        // Amber
  error: '#EF4444',          // Red
  info: '#3B82F6',           // Blue
  
  // Neutral
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    400: '#9CA3AF',
    900: '#111827',
    950: '#030712'
  }
}
```

### Typography

```javascript
// Font Family
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace']
}

// Font Sizes
text-xs: 0.75rem    // 12px
text-sm: 0.875rem   // 14px
text-base: 1rem     // 16px
text-lg: 1.125rem   // 18px
text-xl: 1.25rem    // 20px
text-2xl: 1.5rem    // 24px
text-3xl: 1.875rem  // 30px
text-4xl: 2.25rem   // 36px
text-7xl: 4.5rem    // 72px
```

### Visual Effects

- **Backdrop Blur**: `backdrop-blur-xl` for glassmorphism
- **Border Glow**: `border-white/10` with hover transitions
- **Spotlight**: Radial gradient following mouse cursor
- **Aurora**: Animated gradient blobs in hero section
- **Spring Physics**: `type: "spring", stiffness: 300, damping: 20`

---

## ✨ Features

### 🏠 Landing Page
- Animated hero with gradient text
- Bento grid feature showcase
- Team member display
- Dual-mode authentication modal (Sign In/Sign Up)

### 👨‍🎓 Student Dashboard
- Circular progress score indicator
- Sentiment trend visualization
- AI-generated feedback summaries
- Interactive evaluation form with real-time AI analysis

### 👩‍🏫 Teacher Dashboard
- Class analytics with statistics cards
- Student performance table with bias detection
- Activity creation modal with rubric builder
- Anomaly detection tooltips

### 🔐 Admin Dashboard
- User management table
- Account activation/suspension
- Role-based filtering
- Glitch effects on dangerous actions

### 🎯 Shared Components
- Glassmorphic cards with spotlight effects
- Shimmer buttons with gradient borders
- Interactive rating pills (no radio buttons!)
- Smooth modal transitions
- Loading states with animated icons

---

## 📁 Project Structure

```
frontend/
├── public/                   # Static assets
│   └── vite.svg
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Primitives (Card, Button, Input)
│   │   │   ├── Card.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Textarea.jsx
│   │   │
│   │   ├── layout/         # Layout components
│   │   │   ├── Navigation.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── dashboard/      # Dashboard-specific
│   │   │   ├── ScoreIndicator.jsx
│   │   │   ├── SentimentChart.jsx
│   │   │   └── BiasAlert.jsx
│   │   │
│   │   └── forms/          # Form components
│   │       ├── EvaluationForm.jsx
│   │       ├── ActivityForm.jsx
│   │       └── RatingPills.jsx
│   │
│   ├── pages/              # Page components
│   │   ├── LandingPage.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── services/           # API service layer
│   │   ├── api.js          # Axios instance
│   │   ├── mockData.js     # Mock data for development
│   │   ├── authService.js  # Authentication
│   │   ├── evaluationService.js
│   │   ├── dashboardService.js
│   │   └── adminService.js
│   │
│   ├── context/            # React Context
│   │   └── AuthContext.jsx # Authentication state
│   │
│   ├── utils/              # Helper functions
│   │   ├── cn.js           # Class name utility
│   │   └── dateFormatter.js
│   │
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
│
├── .env                    # Environment variables
├── .env.example            # Environment template
├── .gitignore
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+

### Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install
# or
yarn install
```

### Environment Setup

Create a `.env` file in the frontend root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AI_SERVICE_URL=http://localhost:5000

# Google OAuth2
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# Feature Flags
VITE_USE_MOCK_DATA=true
VITE_ENABLE_ANIMATIONS=true
```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at **http://localhost:5173**

### Development Features

- ⚡ **Hot Module Replacement (HMR)** - Instant updates without refresh
- 🔍 **React DevTools** - Component inspection
- 🎨 **Tailwind IntelliSense** - Auto-complete for classes

### Mock Mode

By default, the app runs in **mock mode** with hardcoded data. To switch to real API:

1. Set `VITE_USE_MOCK_DATA=false` in `.env`
2. Ensure backend is running on `http://localhost:8080`

### Demo Accounts

For testing, use these email patterns:

```javascript
// Student Dashboard
maria.student@cit.edu

// Teacher Dashboard
smith.teacher@cit.edu

// Admin Dashboard
admin.admin@cit.edu
```

---

## 🏗️ Build & Deploy

### Production Build

```bash
npm run build
# or
yarn build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

Make sure to set these in your hosting platform:

```env
VITE_API_BASE_URL=https://api.apeer.com
VITE_GOOGLE_CLIENT_ID=production_client_id
VITE_USE_MOCK_DATA=false
```

---

## ⚙️ Configuration

### Tailwind Config

`tailwind.config.js` includes custom colors and animations:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        teal: {
          400: '#00BFA5',
          500: '#00BFA5',
        },
        purple: {
          600: '#7C3AED',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  }
}
```

### Vite Config

`vite.config.js` handles module resolution and optimizations:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 🧩 Component Library

### UI Primitives

#### Card
```jsx
import { Card } from './components/ui/Card';

<Card spotlight hover className="p-6">
  <h3>My Card</h3>
</Card>
```

#### Button
```jsx
import { Button } from './components/ui/Button';

<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

// Variants: primary, secondary, ghost, danger
```

#### Input
```jsx
import { Input } from './components/ui/Input';

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Animation Examples

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Card entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Modal
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      Modal Content
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Tailwind classes not working
```bash
# Clear cache and rebuild
rm -rf node_modules .vite
npm install
npm run dev
```

**Issue**: Framer Motion animations lag
```javascript
// Reduce spring stiffness in motion config
transition={{ type: "spring", stiffness: 100, damping: 15 }}
```

**Issue**: Mock data not loading
```javascript
// Check services/mockData.js export
// Verify USE_MOCK flag in service files
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';
```

---

## 📝 Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "vite build",            // Production build
  "preview": "vite preview",        // Preview production build
  "lint": "eslint src",             // Run ESLint
  "lint:fix": "eslint src --fix",   // Fix linting issues
  "format": "prettier --write src"  // Format code
}
```

---

## 🤝 Contributing

### Code Style

- Use **functional components** with hooks
- Follow **Airbnb React Style Guide**
- Use **Tailwind utility classes** (no custom CSS unless necessary)
- Add **PropTypes** for all components
- Write **meaningful commit messages**

### Component Checklist

- [ ] Responsive design (mobile-first)
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Animated (Framer Motion)
- [ ] Documented (JSDoc comments)
- [ ] Tested (React Testing Library)

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion API](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)

---

## 📄 License

Part of the APEER academic project © 2025

---

<div align="center">

**Built with ⚡ by the APEER Frontend Team**

</div>

