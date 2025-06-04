# Blueprint UI Component Library

A comprehensive React component library built with TypeScript, Tailwind CSS, and Vite.

## Project Structure

```
src/
├── components/           # All UI components organized by category
│   ├── common/          # Reusable common components
│   │   ├── buttons/     # Button components (Button, IconButton, PrintButton)
│   │   ├── inputs/      # Input components (InputField, Checkbox, DateTimePicker, etc.)
│   │   ├── display/     # Display components (Accordion, BadgeCounter, Pagination, etc.)
│   │   ├── feedback/    # Feedback components (Alerts, Notifications, Toast, etc.)
│   │   └── overlays/    # Overlay components (Modal, Dialog, DropdownMenu)
│   ├── forms/           # Form-related components
│   ├── navigation/      # Navigation components
│   │   ├── nav-components/  # Navigation UI components (NavBar, DrawerNav, etc.)
│   │   └── routing/     # Routing-related components
│   ├── data-visualization/  # Data visualization components
│   │   ├── analytics/   # Analytics dashboards and settings
│   │   ├── charts/      # Chart components (future expansion)
│   │   └── maps/        # Map-related components (InteractiveMap, MapMarkers, etc.)
│   ├── layout/          # Layout components
│   │   ├── containers/  # Container components (AdvancedLayoutManager, etc.)
│   │   └── grid/        # Grid system components (future expansion)
│   ├── media/           # Media components (future expansion)
│   └── widgets/         # Specialized widget components (Charts, Calendar, etc.)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions and helpers
├── types/               # TypeScript type definitions
├── constants/           # Application constants
├── styles/              # Additional styling files
├── assets/              # Static assets
│   ├── icons/           # Icon files
│   └── images/          # Image files
├── examples/            # Component usage examples
├── stories/             # Storybook stories (if using Storybook)
├── tests/               # Test files
├── docs/                # Documentation files
└── lib/                 # Third-party library configurations
```

## Component Categories

### Common Components
- **Buttons**: Button, IconButton, PrintButton
- **Inputs**: InputField, Checkbox, DateTimePicker, FileUpload, Slider, etc.
- **Display**: Accordion, BadgeCounter, Pagination, StatusIndicator, etc.
- **Feedback**: AlertBanner, ToastNotification, ProgressNotification, etc.
- **Overlays**: Modal, Dialog, DropdownMenu

### Specialized Components
- **Forms**: Form validation and submission components
- **Navigation**: NavBar, DrawerNav, NavigationSystem, RouteMapping
- **Data Visualization**: Analytics dashboards, interactive maps, charts
- **Layout**: Advanced layout managers, resizable widgets
- **Widgets**: Charts, calendars, data tables, weather widgets

## Usage

Import components using the organized structure:

```typescript
// Import common components
import { Button, InputField, Modal } from '@/components/common';

// Import specific categories
import { NavBar, DrawerNav } from '@/components/navigation';
import { InteractiveMap, MapMarkers } from '@/components/data-visualization/maps';
import { DashboardAnalytics } from '@/components/data-visualization/analytics';
```

## Development

This project uses:
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **PostCSS** for CSS processing

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Contributing

When adding new components:
1. Place them in the appropriate category folder
2. Update the corresponding index.ts file
3. Add proper TypeScript types
4. Include usage examples in the examples/ folder