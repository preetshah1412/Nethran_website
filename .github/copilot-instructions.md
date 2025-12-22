# Nethran Website - AI Agent Instructions

## Architecture Overview
This is a single-page React application built with Vite, featuring a portfolio/landing page for IT services. The app consists of sequential sections (Hero, About, Services, Testimonials, Contact) wrapped in a fixed header and footer, with interactive background effects and cursor animations.

Key structural decisions:
- All components live in `src/components/` for flat organization
- Global state is minimal; components are self-contained with local state
- Effects (SplashCursor, BackgroundFX) run independently and update CSS variables for dynamic styling

## Component Patterns
- **Functional components** with React hooks (useState, useEffect)
- **Reusable effect components**: GradientText for animated gradients, StarBorder for animated borders
- **Data-driven rendering**: Services component maps over a static array to generate cards
- **Form handling**: Contact uses react-select for dropdowns; basic form validation with reportValidity()

Example: GradientText accepts colors array and animationSpeed props:
```jsx
<GradientText colors={['#40ffaa', '#4079ff']} animationSpeed={3}>
  Explore Services
</GradientText>
```

## Styling Conventions
- **CSS variables** in `:root` for theming (colors, positions)
- **Global styles.css** with custom properties updated dynamically by effects
- **Class-based animations**: `.reveal` class triggers intersection observer animations
- **Responsive design** via container max-width and padding

Effects update CSS vars like `--mx`, `--my` for mouse position, enabling dynamic backgrounds.

## Developer Workflows
- **Development**: `npm run dev` starts Vite dev server with hot reload
- **Build**: `npm run build` outputs to `dist/` directory
- **Preview**: `npm run preview` serves built files locally
- **No tests or linting** configured; manual verification required

## Key Files
- `src/App.jsx`: Main app structure, smooth scrolling, intersection observer setup
- `src/styles.css`: Global styles, CSS variables, animations
- `src/components/SplashCursor.jsx`: WebGL fluid simulation for cursor effects
- `src/components/BackgroundFX.jsx`: Mouse trail and click splash effects

When adding new sections, follow the pattern in App.jsx: import component, add to main element, ensure id matches navigation.</content>
<parameter name="filePath">e:\Nethran\Website\.github\copilot-instructions.md