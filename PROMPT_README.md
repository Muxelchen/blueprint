# Blueprint AI Development Prompts

This document contains AI prompts specifically designed for building web applications using the Blueprint framework. These prompts are optimized to provide maximum functionality with minimal input from developers.

## Main Blueprint Web App Generation Prompt

Use this comprehensive prompt to generate a complete Blueprint web application with minimal input:

```
I need to build a web application using the Blueprint framework for [ORGANIZATION/COMPANY NAME]. 

PURPOSE: This application will [primary purpose - e.g., "track customer sales data", "manage employee schedules", "visualize marketing analytics"].

USERS: The primary users will be [brief user description - e.g., "sales managers", "HR staff", "marketing team"].

Please generate a complete Blueprint implementation plan including:

1. The most appropriate Blueprint template for this use case
2. CLI commands to set up the project
3. Key components from Blueprint's library that should be included
4. A recommended layout structure
5. Data management approach
6. Styling customization to match our brand/needs
7. Performance optimizations for our specific use case
8. Implementation steps in order of priority

OPTIONAL SPECIFICATIONS (include any that apply):
- Features needed: [list any specific features you want]
- Color scheme: [basic color info if available]
- Responsive requirements: [any specific device support needed]
- Authentication needs: [simple/complex/SSO/etc.]
- Data visualization needs: [charts/maps/tables/etc.]

Please provide code examples for the most critical parts and explain any important architectural decisions.
```

## Focused Short Prompts

Use these focused prompts when you need specific aspects of your Blueprint application:

### 1. Initial Project Setup

```
I want to create a web app using Blueprint. My app will be a [type of app: dashboard/analytics/data table/maps] for [brief purpose]. Generate the CLI commands to create this project and explain the initial file structure.
```

**Example:**
```
I want to create a web app using Blueprint. My app will be a dashboard for tracking sales performance. Generate the CLI commands to create this project and explain the initial file structure.
```

### 2. Component Selection

```
For my Blueprint app, I need components for [1-3 specific features]. Suggest the most appropriate Blueprint components and show how to integrate them into my project.
```

**Example:**
```
For my Blueprint app, I need components for data visualization, user notifications, and real-time charts. Suggest the most appropriate Blueprint components and show how to integrate them into my project.
```

### 3. Layout Definition

```
Using Blueprint's layout system, help me structure a page with [describe basic layout needs: header, sidebar, main content, etc]. Show the code for this layout structure.
```

**Example:**
```
Using Blueprint's layout system, help me structure a page with a fixed header, collapsible sidebar, main dashboard area, and footer. Show the code for this layout structure.
```

### 4. Styling Customization

```
I want to customize the visual theme of my Blueprint app to match [brief description: brand colors, dark mode, etc]. Show me how to modify the theme configuration.
```

**Example:**
```
I want to customize the visual theme of my Blueprint app to match our company's green and blue brand colors with dark mode support. Show me how to modify the theme configuration.
```

### 5. Data Handling

```
Show me how to connect Blueprint components to display [type of data] from a mock data source.
```

**Example:**
```
Show me how to connect Blueprint components to display sales metrics and user analytics from a mock data source.
```

### 6. Performance Optimization

```
What Blueprint features should I use to optimize performance for my [specific feature] that will handle [brief description of scale/complexity]?
```

**Example:**
```
What Blueprint features should I use to optimize performance for my data table that will handle 10,000+ rows with real-time updates?
```

## Advanced Feature-Specific Prompts

### Authentication Integration
```
Help me integrate authentication into my Blueprint app. I need [simple login/OAuth/SSO] with user profile management and role-based access control.
```

### Real-time Features
```
I want to add real-time functionality to my Blueprint app for [specific feature]. Show me how to implement WebSocket connections and real-time data updates.
```

### Mobile Optimization
```
Help me make my Blueprint app mobile-responsive with touch-friendly interactions for [specific use case].
```

### API Integration
```
Show me how to integrate my Blueprint app with a REST API for [specific data type] including error handling and loading states.
```

### Advanced Charts
```
I need advanced data visualization in my Blueprint app including [specific chart types] with interactive features and real-time updates.
```

## Tips for Using These Prompts

1. **Be Specific**: Replace bracketed placeholders with your actual requirements
2. **Combine Prompts**: You can combine multiple focused prompts for complex requirements
3. **Iterate**: Start with the main prompt, then use focused prompts to refine specific areas
4. **Context**: Provide context about your users and use case for better recommendations
5. **Follow-up**: Ask follow-up questions about implementation details or alternative approaches

## Example Complete Workflow

1. **Start with Main Prompt:**
   ```
   I need to build a web application using the Blueprint framework for TechCorp Inc. 
   
   PURPOSE: This application will track customer support tickets and team performance metrics.
   
   USERS: The primary users will be support managers and customer service representatives.
   ```

2. **Refine with Focused Prompts:**
   ```
   For my Blueprint app, I need components for ticket management, performance dashboards, and team communication. Suggest the most appropriate Blueprint components and show how to integrate them into my project.
   ```

3. **Customize Further:**
   ```
   I want to customize the visual theme of my Blueprint app to match our corporate blue and white brand colors with professional styling. Show me how to modify the theme configuration.
   ```

## Blueprint CLI Integration

Before using these prompts, ensure you have Blueprint set up:

```bash
# Install dependencies
npm install

# View available templates
npm run cli list

# Create new app (replace with AI-suggested template)
npm run cli create my-app --template dashboard

# Start development
cd my-app && npm run dev
```

---

**Note**: These prompts are designed to work with AI assistants that understand the Blueprint framework structure and components. Always review generated code and adapt it to your specific requirements.