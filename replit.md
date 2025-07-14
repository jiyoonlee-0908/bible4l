# BibleAudio 4L - Multilingual Bible Audio PWA

## Overview

BibleAudio 4L is a Progressive Web Application (PWA) that provides Bible audio playback functionality with support for 4 languages (Korean, English, Chinese, Japanese). The application is designed as a mobile-first experience with an intuitive interface for listening to Bible verses, managing bookmarks, and customizing playback settings.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: React hooks with local state and custom hooks for data management
- **Routing**: Wouter for lightweight client-side routing
- **PWA Features**: Service worker support for offline functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Integration**: External Bible API service for scripture content
- **Development**: Hot module replacement with Vite middleware in development

### Data Storage Solutions
- **Primary Storage**: Browser localStorage for user preferences, bookmarks, and settings
- **Database Schema**: Drizzle ORM configured for PostgreSQL (prepared for future database integration)
- **Session Management**: In-memory storage with prepared PostgreSQL session store (connect-pg-simple)

## Key Components

### Core Features
1. **Multi-language Support**: Korean, English, Chinese, Japanese with language-specific Bible API endpoints
2. **Audio Playback**: Web Speech API integration for text-to-speech functionality
3. **Bookmark System**: Local storage-based bookmark management with CRUD operations
4. **Display Modes**: Single verse and double verse display options
5. **Navigation**: Chapter/verse navigation with intuitive controls

### UI Components
- **Responsive Design**: Mobile-first approach with max-width containers
- **Component Library**: Comprehensive UI component system using Radix primitives
- **Theming**: CSS custom properties for consistent theming across components
- **Accessibility**: ARIA-compliant components with keyboard navigation support

### Data Models
- **Verse Schema**: Reference, text, book, chapter, verse, language
- **Bookmark Schema**: Unique ID, verse reference, text, language, timestamp
- **Settings Schema**: Language preference, display mode, playback speed, auto-play
- **Audio State**: Playback status, position, duration, speed controls

## Data Flow

### Client-Side Data Management
1. **Local Storage**: Persistent storage for user settings and bookmarks
2. **React Query**: API data fetching and caching for Bible content
3. **Custom Hooks**: Encapsulated logic for Bible navigation, bookmarks, and speech synthesis
4. **State Synchronization**: Settings persistence across browser sessions

### API Integration
1. **External Bible API**: RESTful API for scripture content retrieval
2. **Language Mapping**: Bible ID mapping for different language versions
3. **Error Handling**: Graceful fallbacks for API failures
4. **Caching Strategy**: Query-based caching for frequently accessed verses

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library
- **drizzle-orm**: Type-safe ORM for future database integration

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and enhanced developer experience
- **ESLint/Prettier**: Code quality and formatting
- **PostCSS**: CSS processing and optimization

### External Services
- **Bible API**: Third-party scripture content provider
- **Web Speech API**: Browser-native text-to-speech functionality

## Deployment Strategy

### Production Build
1. **Frontend**: Vite builds React application to static assets
2. **Backend**: esbuild bundles Express server for Node.js deployment
3. **Assets**: Optimized static file serving with proper caching headers

### Environment Configuration
- **Development**: Hot reload with Vite dev server and Express middleware
- **Production**: Static file serving through Express with proper error handling
- **Database**: PostgreSQL connection ready (Neon serverless configured)

### PWA Features
- **Service Worker**: Offline functionality and asset caching
- **Manifest**: App installation and mobile app-like experience
- **Performance**: Optimized loading and runtime performance

### Scalability Considerations
- **Database Migration**: Ready for PostgreSQL integration with Drizzle migrations
- **Session Management**: Prepared for server-side session storage
- **API Rate Limiting**: Consideration for external API usage limits
- **CDN Integration**: Static asset optimization for global distribution