# calcula.Ai PWA

## Overview

calcula.Ai is a Progressive Web App (PWA) for personal financial management with complete offline functionality. The application enables users to track income and expenses, manage budgets, and visualize financial data through interactive charts. Built with a focus on Brazilian localization (pt-BR), it provides date formatting (dd/mm/yyyy) and currency display (R$) tailored for Brazilian users.

The application is designed as a fully offline-capable PWA that can be installed on devices and function without internet connectivity. All data is stored locally using IndexedDB, ensuring privacy and immediate access to financial information.

## Recent Changes

**November 7, 2025 - Replit Environment Setup Complete**
- Fresh GitHub import successfully configured for Replit
- Installed all npm dependencies (741 packages)
- Configured development workflow (`dev-server`) to run on port 5000 with webview output
- Vite development server configured with:
  - Host: 0.0.0.0 (required for Replit)
  - Port: 5000 (frontend)
  - allowedHosts: true (to work with Replit's proxy/iframe)
- Express backend server configured for development HMR and production static serving
- Set up deployment configuration for Replit autoscale:
  - Build: `npm run build`
  - Run: `npm start`
- Verified frontend is working correctly with Brazilian Portuguese localization
- All TypeScript LSP errors resolved
- Note: Application is 100% client-side (IndexedDB), no backend API needed. Express server only serves static files.

**November 5, 2025 - Configured for Hostinger Deployment**
- Successfully imported project from GitHub
- **Prepared for static hosting on Hostinger**:
  - Created production build in `dist/public/` directory
  - Added `.htaccess` file for Apache/SPA routing
  - Created detailed setup guide in `HOSTINGER_SETUP.md`

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- **Build Tool**: Vite with React and TypeScript for fast development and optimized production builds
- **UI Framework**: React with TypeScript for type-safe component development
- **Styling**: TailwindCSS with shadcn/ui component library following a design system approach inspired by Linear, Nubank, and Notion
- **State Management**: Zustand for global state management, providing a simple and efficient store for transactions, categories, budgets, and filters
- **Charts**: Recharts library for data visualization (pie charts for expense categories, line charts for balance trends)

**Component Architecture:**
- Modular component structure with separate directories for UI primitives (`/components/ui`), business components (`/components`), and examples
- shadcn/ui design system with customized themes supporting both light and dark modes
- Typography hierarchy using Inter font for general text and JetBrains Mono for numeric/currency values
- Responsive grid layouts: single column (mobile), two columns (tablet), three columns (desktop)

**Design Approach:**
- Productivity/Finance-focused design system prioritizing clarity over decoration
- Consistent spacing using Tailwind's 2, 4, 6, and 8 unit system
- Touch-friendly mobile interactions with appropriate tap targets
- Visual hierarchy through typography, spacing, and color contrast

### Data Storage & Persistence

**IndexedDB Implementation:**
- Uses the `idb` library for IndexedDB interactions with a promise-based API
- Database name: `seu_financas`, version 1
- Four object stores:
  - `transactions`: Stores income/expense records with indexes on date and type
  - `categories`: Stores income and expense categories
  - `budgets`: Stores monthly budget limits per expense category
  - `meta`: Stores application metadata

**Data Models:**
- **Transaction**: `{ id, type ('income'|'expense'), date (ISO), category, description, amount }`
- **Category**: `{ id, name, type ('income'|'expense') }`
- **Budget**: `{ id (category ID), limit (monthly amount) }`
- **Meta**: `{ key, value }` for application settings

**State Persistence:**
- UI state and filters persisted to localStorage
- Full data export/import functionality via JSON for backup and migration

### Progressive Web App (PWA) Features

**Service Worker Strategy:**
- Implemented using `vite-plugin-pwa` with Workbox for cache management
- **App Shell**: NetworkFirst strategy with offline fallback for HTML
- **Static Assets**: StaleWhileRevalidate for JS/CSS/fonts to ensure fresh content with offline availability
- **Images/Icons**: CacheFirst with 30-day maximum age for optimal performance
- **Offline Fallback**: Dedicated `/offline.html` page when network is unavailable

**PWA Manifest:**
- Complete manifest with Portuguese (pt-BR) localization
- Multiple icon sizes (192x192, 256x256, 384x384, 512x512) including maskable icons
- Standalone display mode for app-like experience
- Portrait orientation optimized for mobile devices
- Categories: finance, productivity
- Shortcuts for quick access to new transaction creation

**Installation Prompt:**
- Custom UI component (`InstallPrompt`) that listens for `beforeinstallprompt` event
- User-friendly installation dialog with dismiss option
- Persistent across sessions until installed or explicitly dismissed

### Key Features & Business Logic

**Transaction Management:**
- Full CRUD operations for income and expense transactions
- Real-time filtering by month, type, category, and text search
- Monthly totals calculation for income, expenses, and balance
- Seed data generation for initial user experience

**Budget Management:**
- Per-category budget limits for expense categories
- Visual progress indicators with color-coded alerts:
  - Green: Under 80% of budget
  - Yellow: 80-99% of budget
  - Red: At or over 100% of budget
- Budget creation, editing, and deletion

**Data Visualization:**
- **Expense Pie Chart**: Breakdown of expenses by category with percentage labels
- **Balance Line Chart**: Cumulative balance progression throughout the month
- Default Recharts color palette (not hardcoded) for flexibility

**Data Portability:**
- JSON export of all data (transactions, categories, budgets, metadata)
- JSON import with validation for data restoration
- File downloads named with timestamp for organization

**Localization:**
- Brazilian Portuguese (pt-BR) throughout the application
- Currency formatting in BRL (R$) with proper thousands/decimal separators
- Date formatting as dd/mm/yyyy
- Month names in Portuguese for filters and displays

### Backend Architecture

**Server Setup:**
- Express.js server for development and production serving (Replit only)
- Vite integration in development mode with HMR (Hot Module Replacement)
- Static file serving for production builds
- Middleware for JSON parsing and request logging

**Hosting Options:**
1. **Static Hosting (Hostinger, Vercel, Netlify)**:
   - Application is 100% client-side, no backend needed
   - All files in `dist/public/` can be hosted on any static host
   - Includes `.htaccess` for Apache servers (Hostinger)
   - See `HOSTINGER_SETUP.md` for detailed instructions

2. **Replit Deployment**:
   - Express server serves static files from `dist/public/`
   - Autoscale deployment configured
   - No API endpoints required (application is client-only)

**Database Schema (Drizzle + PostgreSQL):**
- Note: The application uses IndexedDB for client-side storage. Drizzle configuration exists but is not actively used.
- Schema includes a basic `users` table with username/password fields
- PostgreSQL dialect configured via `@neondatabase/serverless`
- Migration output directory: `./migrations`

**Storage Interface:**
- Abstract `IStorage` interface for potential backend data operations
- `MemStorage` implementation using in-memory Map for user data
- Currently unused - application relies entirely on client-side IndexedDB storage

### Build & Development

**Development:**
- TypeScript strict mode enabled for type safety
- ESNext module system with ESM imports/exports
- Path aliases: `@/` for client source, `@shared/` for shared code, `@assets/` for attached assets
- Development server runs on port 5000 (configurable)

**Production Build:**
- Vite builds optimized client bundle to `dist/public`
- esbuild bundles server code to `dist/index.js`
- All builds use ESM format for consistency
- Service worker and manifest generated during build

**Code Organization:**
- Monorepo structure with client, server, and shared code
- Client code in `/client/src`
- Server code in `/server`
- Shared schemas and types in `/shared`
- Public assets in `/client/public`

## External Dependencies

### UI & Styling Libraries
- **@radix-ui/react-***: Comprehensive collection of unstyled, accessible UI primitives (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, label, popover, progress, radio-group, select, separator, slider, switch, tabs, toast, tooltip, etc.)
- **TailwindCSS**: Utility-first CSS framework for styling
- **class-variance-authority**: For type-safe variant-based component styling
- **clsx** & **tailwind-merge**: Utility for conditional className composition
- **cmdk**: Command palette component
- **lucide-react**: Icon library

### Data & State Management
- **zustand**: Lightweight state management library
- **idb**: Promise-based IndexedDB wrapper (client-side database)
- **@tanstack/react-query**: Server state management and caching

### Charting
- **recharts**: Composable charting library for React
- **embla-carousel-react**: Carousel component

### Forms & Validation
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Zod schema generation from Drizzle ORM schemas

### Date Handling
- **date-fns**: Modern JavaScript date utility library

### PWA
- **vite-plugin-pwa**: Vite plugin for PWA with Workbox integration
- Service Worker registration for offline functionality
- Cache strategies for assets and API calls

### Backend & Database (Configured but not actively used)
- **express**: Web framework for Node.js
- **@neondatabase/serverless**: Neon serverless PostgreSQL driver
- **drizzle-orm**: TypeScript ORM for SQL databases
- **drizzle-kit**: CLI tool for Drizzle ORM migrations
- **connect-pg-simple**: PostgreSQL session store (configured but not used)

### Development Tools
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and dev server
- **@vitejs/plugin-react**: React plugin for Vite
- **esbuild**: JavaScript bundler for server code
- **tsx**: TypeScript execution engine
- **@replit/vite-plugin-***: Replit-specific development tools (runtime error modal, cartographer, dev banner)

### Fonts
- **Google Fonts**: Inter (primary font) and JetBrains Mono (monospace for numbers)