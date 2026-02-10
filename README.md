# AgroSense AI Frontend

A modern farming intelligence dashboard built with React + Vite + Tailwind CSS.

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Fourth-X-Born/agro-sense-AI-frontend.git
cd agro-sense-AI-frontend
```

### 2. Switch to dev branch
```bash
git checkout dev
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run development server
```bash
npm run dev
```

### 5. Open in browser
Navigate to: **http://localhost:5173** (or the port shown in terminal)

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/         # Shared dashboard components
│   │   ├── DashboardNavbar.jsx
│   │   └── DashboardFooter.jsx
│   └── landing/           # Landing page components
│       ├── Navbar.jsx
│       ├── Hero.jsx
│       ├── Features.jsx
│       ├── HowItWorks.jsx
│       └── CTASection.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── AuthPage.jsx
│   ├── DashboardPage.jsx
│   ├── CropRiskPage.jsx
│   ├── WeatherPage.jsx
│   ├── MarketPricesPage.jsx
│   ├── CropGuidePage.jsx
│   └── ProfileSettingsPage.jsx
├── routes/
│   └── AppRoutes.jsx      # All route definitions
└── index.css              # Tailwind config + custom styles
```

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login form |
| `/register` | Registration form |
| `/dashboard` | Farmer dashboard |
| `/crop-risk` | AI crop risk assessment |
| `/weather` | Weather forecasts |
| `/market-prices` | Market price tracker |
| `/crop-guide` | Crop cultivation guide |
| `/settings` | User profile settings |

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router v6** - Routing
- **Material Symbols** - Icons

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.
