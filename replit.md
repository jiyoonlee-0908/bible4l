# BibleAudio 4L - Multilingual Bible Audio PWA

## Overview

BibleAudio 4L is a Progressive Web Application (PWA) that provides Bible audio playbook functionality with support for 4 languages (Korean, English, Chinese, Japanese). The application is designed as a mobile-first experience with an intuitive interface for listening to Bible verses, managing bookmarks, customizing playback settings, reading plans, and achievement badges. The app uses public domain Bible translations to ensure commercial viability without licensing costs.

## User Preferences

```
Preferred communication style: Simple, everyday language.
Commercial use: Prioritize cost-free solutions using public domain content.
Ad-supported model: Keep only ad-supported version, Pro version to be developed separately later.
```

## Recent Changes (January 2025)

✓ Switched to public domain Bible API (bible-api.com) for commercial viability
✓ Added DSP audio effects: Echo, Reverb, 3-band EQ, Pitch control (±4 semitones)
✓ Implemented 90-day and 365-day reading plans with progress tracking
✓ Created badge/achievement system with streak tracking and listening time
✓ Enhanced audio controls with speed (0.5x-1.5x) and pitch adjustment
✓ Added tabbed settings interface: Audio, Reading Plans, Badges
✓ Integrated badge checking for first listen and bookmark milestones
✓ Completed wood tone color scheme throughout entire app (성경책처럼)
✓ Implemented 6-level font size adjustment with Type icon for accessibility (노안 대응)
✓ Fixed Bible navigation to show diverse verses using hash-based fallback system
✓ Added continuous playback in Player with auto-advance to next verse
✓ Resolved API fetch errors with reliable fallback verse system
✓ Created 5 custom wood-toned Bible app icons with country flags and "성경듣기" text
✓ Added single verse repeat functionality in player alongside continuous playback
✓ Extended speed control to 0.5x minimum for slower listening preferences
✓ Finalized app icon design with text-only layout: "성경", "듣기", "한 영 중 일"
✓ Selected darker wood tone design (option 2) with optimal text sizing and spacing
✓ Applied consistent dark wood tone color palette throughout entire UI/UX
✓ Updated CSS custom properties for wood-inspired design theme matching the icon
✓ Integrated Kakao AdFit advertising system with strategic placement (home, player, settings)
✓ Completely removed subscription system - now ad-supported only for future Pro version separation
✓ Fixed bottom navigation to properly anchor to device bottom edge
✓ Removed ad placement between Bible selection and language selection for better UX
✓ Optimized TTS voices with hardcoded language-specific settings for natural pronunciation
✓ Updated player mode labels to "한 구절 반복" and "전체 듣기" for better user clarity
✓ Removed all advertisements - ads require actual app store registration for approval
✓ AdFitBanner component kept for future use after app store deployment
✓ Adjusted bottom padding to pb-24 for optimal spacing without excessive whitespace
✓ Improved header icons: amber color scheme matching title, intuitive font size icon (small A + big A)
✓ Data persistence confirmed: localStorage saves all user data permanently across app sessions
✓ Fixed Preview runtime errors with improved error handling and React import fixes
✓ Fixed "모든 데이터 삭제" to properly clear reading plan progress and reload page
✓ Replaced hardcoded reading plan progress with actual data from useReadingPlan hook
✓ Extended reading plans to full 90 and 365 days with complete daily reading schedules
✓ Localized reading plan book names to Korean (창세기, 출애굽기, etc.)
✓ Enhanced TTS voice selection with stronger Google voice enforcement for mobile devices
✓ Added comprehensive voice debugging logs to troubleshoot mobile TTS issues
✓ Fixed badge system with proper event-driven architecture for real-time badge unlocking
✓ Connected badge checks to actual app activities (listening, bookmarks, reading plans, streaks)
✓ Added totalListeningTime tracking to settings schema for accurate badge calculations
✓ Implemented automatic TTS voice initialization system for 4 languages at app startup
✓ Added VoiceInitializer component for guided voice setup and optimization
✓ Enhanced TTS voice selection with preferred voice storage and fallback system
✓ Added comprehensive voice testing and mobile optimization features
✓ Created TTSInstallGuide component with platform-specific Google TTS installation instructions
✓ Integrated missing language detection and automatic TTS download guidance system
✓ Added Android/iOS/Desktop-specific TTS installation workflows with direct store links
✓ Modified TTS popup to show repeatedly until "다시 보지 않기" is clicked (not just first-time)
✓ Improved Android TTS language addition with direct settings navigation and detailed instructions
✓ Added comprehensive 3-method guidance for Chinese/Japanese voice installation
✓ Created TTSEngineDetector component for automatic TTS engine identification (Google/Samsung/etc.)
✓ Implemented VoiceLanguageChecker for detailed language-specific voice availability testing
✓ Added voice quality diagnosis with real-time testing for all 4 languages
✓ Enhanced TTS setup with manufacturer-specific guidance (Samsung TTS vs Google TTS)
✓ Integrated direct language install attempts for missing voice packages

## Play Store Deployment Preparation (January 15, 2025)

✓ Enhanced Service Worker with comprehensive offline support and error handling
✓ Improved PWA manifest with proper app identity and shortcuts
✓ Created privacy policy page accessible at /privacy endpoint
✓ Generated digital asset links template for Android App Links verification
✓ Added service worker registration with update notification system
✓ Created feature graphic (1024x500) for Play Store listing
✓ Prepared all required Play Store assets and documentation
✓ Implemented proper error boundaries and offline fallback pages
✓ Added build instructions and deployment guide for user
✓ All PWA requirements met: HTTPS, manifest, service worker, offline support

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
- **API Integration**: bible-api.com (public domain, commercial-friendly)
- **Development**: Hot module replacement with Vite middleware in development

### Data Storage Solutions
- **Primary Storage**: Browser localStorage for user preferences, bookmarks, settings, progress, and badges
- **Database Schema**: Drizzle ORM configured for PostgreSQL (prepared for future database integration)
- **Session Management**: In-memory storage with prepared PostgreSQL session store (connect-pg-simple)

## Key Components

### Core Features
1. **Multi-language Support**: Korean, English, Chinese, Japanese with public domain translations
2. **Audio Playback**: Web Speech API integration with DSP effects (echo, reverb, EQ, pitch)
3. **Bookmark System**: Local storage-based bookmark management with CRUD operations
4. **Display Modes**: Single verse and double verse display options
5. **Navigation**: Chapter/verse navigation with intuitive controls
6. **Reading Plans**: 90-day and 365-day Bible reading schedules with progress tracking
7. **Achievement System**: Badge unlocking based on streaks, listening time, and completion rates
8. **Advanced Audio Controls**: Speed adjustment (0.8x-1.5x), pitch control (±4 semitones), 3-band EQ

### UI Components
- **Responsive Design**: Mobile-first approach with max-width containers
- **Component Library**: Comprehensive UI component system using Radix primitives
- **Theming**: CSS custom properties for consistent theming across components
- **Accessibility**: ARIA-compliant components with keyboard navigation support

### Data Models
- **Verse Schema**: Reference, text, book, chapter, verse, language
- **Bookmark Schema**: Unique ID, verse reference, text, language, timestamp
- **Settings Schema**: Language preference, display mode, playback speed, pitch, DSP effects, auto-play
- **Audio State**: Playback status, position, duration, speed, pitch controls
- **Reading Plan Schema**: Plan type, daily readings, total days, progress tracking
- **Progress Schema**: Current day, completed days, streak count, total listening time
- **Badge Schema**: Achievement conditions, unlock status, metallic effects

## Data Flow

### Client-Side Data Management
1. **Local Storage**: Persistent storage for user settings and bookmarks
2. **React Query**: API data fetching and caching for Bible content
3. **Custom Hooks**: Encapsulated logic for Bible navigation, bookmarks, and speech synthesis
4. **State Synchronization**: Settings persistence across browser sessions

### API Integration
1. **bible-api.com**: Public domain Bible API (commercial-friendly, MIT license)
2. **Language Mapping**: Public domain translations (KJV, CUV, etc.) with localized book names
3. **Error Handling**: Graceful fallbacks with sample verses for offline functionality
4. **Caching Strategy**: Query-based caching for frequently accessed verses
5. **Cost Optimization**: Zero API costs using public domain content

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
- **bible-api.com**: Public domain scripture content provider (commercial-friendly)
- **Web Speech API**: Browser-native text-to-speech functionality with DSP enhancements
- **Web Audio API**: Advanced audio processing for EQ and effects

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
- **Cost-Free Operation**: Public domain API eliminates licensing and usage fees
- **CDN Integration**: Static asset optimization for global distribution
- **Achievement Expansion**: Framework ready for additional badge types and conditions
- **Reading Plan Expansion**: Architecture supports custom reading schedules