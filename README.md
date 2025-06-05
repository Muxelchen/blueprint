# 🎨 Blueprint UI System

A comprehensive React component library and rapid app generation system built with TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

### 🧩 Component Library
- **150+ Production-Ready Components** organized by category
- **Common Components**: Buttons, Forms, Navigation, Layout
- **Data Visualization**: Charts, Tables, Analytics widgets
- **Advanced Widgets**: Maps, Calendars, Real-time dashboards
- **Responsive Design** with mobile-first approach
- **Dark Mode Support** and accessibility features
- **Framer Motion Animations** for smooth interactions

### 🚀 Rapid App Generation
- **4 Professional Templates**: Dashboard, Analytics, Data Table, Map Dashboard
- **CLI Tool** for instant app scaffolding
- **Template Customization** with preset configurations
- **Zero-Config Setup** with Vite, TypeScript, and Tailwind

### 📚 Developer Experience
- **TypeScript Support** with full type safety
- **Storybook Integration** for component documentation
- **Modern Build Tools** (Vite, PostCSS, ESLint)
- **Component Registry** for easy discovery
- **Export Functions** for data handling

## 🚀 Quick Start

### Using the CLI (Recommended)

```bash
# List available templates
npm run blueprint list

# Create a new dashboard app
npm run blueprint create my-dashboard --template dashboard

# Create an analytics app
npm run blueprint create my-analytics --template analytics

# Create a data management app  
npm run blueprint create my-data-app --template data-table

# Create a map-based app
npm run blueprint create my-map-app --template map
```

### Manual Setup

```bash
# Clone and install
git clone <repository-url>
cd blueprint
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run Storybook
npm run storybook
```

## 📋 Available Templates

### 🏠 Dashboard Template
**Perfect for:** Business dashboards, admin panels, monitoring systems
```bash
npm run blueprint create my-dashboard --template dashboard
```
- **Features**: KPI Cards, Charts, Data Tables, Quick Actions
- **Dependencies**: Recharts, Zustand
- **Use Cases**: Business analytics, admin dashboards, monitoring

### 📊 Analytics Template  
**Perfect for:** Data analysis, reporting, business intelligence
```bash
npm run blueprint create my-analytics --template analytics
```
- **Features**: Real-time Charts, Goal Tracking, Advanced Metrics, Heat Maps
- **Dependencies**: Recharts, Chart.js, Date-fns
- **Use Cases**: Analytics platforms, reporting tools, BI dashboards

### 📋 Data Table Template
**Perfect for:** CRUD applications, data management, content systems
```bash
npm run blueprint create my-data-app --template data-table
```
- **Features**: Advanced Tables, Search & Filter, CRUD Operations, Bulk Actions
- **Dependencies**: React Router DOM
- **Use Cases**: Admin panels, content management, data entry

### 🗺️ Map Dashboard Template
**Perfect for:** Location-based apps, logistics, field services
```bash
npm run blueprint create my-map-app --template map
```
- **Features**: Interactive Maps, Location Tracking, Route Optimization, Geospatial Analytics
- **Dependencies**: Leaflet, React Leaflet
- **Use Cases**: Fleet management, delivery tracking, field services

## 🧩 Component Categories

### Common Components
```typescript
// Buttons
import { Button, IconButton, PrintButton } from '@/components/common/buttons';

// Display
import { Accordion, BadgeCounter, Pagination, StatusIndicator } from '@/components/common/display';

// Forms
import { Form } from '@/components/forms';

// Layout
import { Header, Sidebar, MainContent, Footer } from '@/components/layout';
```

### Data Visualization
```typescript
// Charts
import { AreaChart, BarChart, LineChart, PieChart } from '@/components/widgets';

// Advanced Widgets
import { KPICard, DataTable, Calendar, Heatmap } from '@/components/widgets';
```

### Specialized Components
```typescript
// Maps
import { MapContainer, LocationMarker } from '@/components/data-visualization/maps';

// Analytics
import { MetricCard, TrendChart, GoalProgress } from '@/components/data-visualization/analytics';
```

## 🛠️ CLI Commands

### List Templates
```bash
npm run blueprint list
```
Shows all available templates with descriptions and features.

### Create New App
```bash
npm run blueprint create <app-name> [options]
```

**Options:**
- `-t, --template <type>`: Template type (dashboard, analytics, data-table, map)
- `-p, --preset <preset>`: Component preset (minimal, standard, full)

**Examples:**
```bash
# Standard dashboard
npm run blueprint create company-dashboard

# Analytics app with full preset
npm run blueprint create analytics-hub --template analytics --preset full

# Data management with minimal components
npm run blueprint create simple-crud --template data-table --preset minimal
```

## 📁 Project Structure

```
blueprint/
├── src/
│   ├── components/          # Component library
│   │   ├── common/         # Reusable UI components
│   │   ├── data-visualization/  # Charts and analytics
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   ├── navigation/     # Navigation components
│   │   └── widgets/        # Specialized widgets
│   ├── templates/          # App templates
│   ├── utils/              # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   └── constants/          # Constants and mock data
├── cli/                    # CLI tool
├── stories/                # Storybook stories
└── docs/                   # Documentation
```

## 🎯 Usage Examples

### Creating a KPI Dashboard
```typescript
import { DashboardTemplate } from '@/templates';
import { KPICard, BarChart, DataTable } from '@/components/widgets';

function MyDashboard() {
  return (
    <DashboardTemplate>
      <KPICard title="Revenue" value="$124,500" trend="+12%" />
      <BarChart data={salesData} />
      <DataTable data={customerData} />
    </DashboardTemplate>
  );
}
```

### Building an Analytics Page
```typescript
import { AnalyticsTemplate } from '@/templates';
import { LineChart, GoalProgress, Heatmap } from '@/components/widgets';

function Analytics() {
  return (
    <AnalyticsTemplate>
      <LineChart data={timeSeriesData} realTime />
      <GoalProgress current={75} target={100} />
      <Heatmap data={activityData} />
    </AnalyticsTemplate>
  );
}
```

### Data Management Interface
```typescript
import { DataTableTemplate } from '@/templates';
import { DataTable, SearchBar, FilterPanel } from '@/components';

function DataManager() {
  return (
    <DataTableTemplate>
      <SearchBar onSearch={handleSearch} />
      <FilterPanel filters={availableFilters} />
      <DataTable 
        data={data}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DataTableTemplate>
  );
}
```

## 🔧 Configuration

### Tailwind Configuration
The system uses a custom Tailwind configuration optimized for dashboard UIs:

```javascript
// tailwind.config.js
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette for dashboards
      },
      animation: {
        // Custom animations
      }
    },
  },
  plugins: [],
}
```

### TypeScript Configuration
Full TypeScript support with strict mode and path mapping:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🎨 Customization

### Theme Customization
```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    // Custom theme colors
  },
  spacing: {
    // Custom spacing scale
  }
};
```

### Component Variants
```typescript
// Components support multiple variants
<Button variant="primary" size="lg" />
<Button variant="outline" size="sm" />
<Button variant="ghost" />
```

## 📚 Documentation

### Storybook
View all components in Storybook:
```bash
npm run storybook
```

### Component Documentation
Each component includes:
- **Props Interface**: Full TypeScript definitions
- **Usage Examples**: Common use cases
- **Variants**: All available styles
- **Accessibility**: ARIA compliance

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy Generated Apps
Generated apps are ready for deployment to:
- **Vercel**: Zero-config deployment
- **Netlify**: Drag and drop deployment  
- **AWS S3**: Static hosting
- **GitHub Pages**: Free hosting

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-component`
3. **Add your component** to the appropriate category
4. **Update the exports** in the index files
5. **Add Storybook stories** for documentation
6. **Submit a pull request**

### Component Guidelines
- Use TypeScript for type safety
- Follow the existing naming conventions
- Include prop interfaces and default values
- Add responsive design support
- Include accessibility features

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Examples**: See `/examples` directory
- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions

---

**Happy Building! 🎉**

Generate professional web applications in seconds with Blueprint's powerful component library and CLI tools.