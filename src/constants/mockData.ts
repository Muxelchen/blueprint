// Complete mock data for all components
import {
  ChartData,
  KPIData,
  WeatherData,
  LocationData,
  MapMarker,
  HeatmapPoint,
  NotificationHistoryItem,
  User,
  TreemapNode,
  GaugeSegment,
} from '../types';

// ===== CHART DATA =====

// Line Chart Data
export const mockLineChartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 35000, 32000, 28000, 40000, 38000, 45000],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Expenses',
      data: [8000, 12000, 10000, 15000, 18000, 20000, 22000, 25000, 23000, 28000, 26000, 30000],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

// Bar Chart Data
export const mockBarChartData: ChartData = {
  labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'],
  datasets: [
    {
      label: 'Sales',
      data: [850, 920, 1100, 1350, 1200, 1450],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    },
    {
      label: 'Target',
      data: [800, 900, 1000, 1300, 1150, 1400],
      backgroundColor: 'rgba(156, 163, 175, 0.5)',
    },
  ],
};

// Pie Chart Data
export const mockPieChartData: ChartData = {
  labels: ['Desktop', 'Mobile', 'Tablet', 'Smart TV', 'Other'],
  datasets: [
    {
      label: 'Device Usage',
      data: [45.2, 32.8, 15.3, 4.7, 2.0],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    },
  ],
};

// Scatter Plot Data
export const mockScatterPlotData: ChartData = {
  datasets: [
    {
      label: 'Dataset 1',
      data: Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })) as any,
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
    },
    {
      label: 'Dataset 2',
      data: Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })) as any,
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
    },
  ],
};

// Area Chart Data
export const mockAreaChartData: ChartData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'CPU Usage',
      data: [20, 35, 60, 45, 70, 55, 30],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      fill: true,
    },
    {
      label: 'Memory Usage',
      data: [15, 25, 40, 35, 50, 45, 25],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.3)',
      fill: true,
    },
  ],
};

// ===== KPI DATA =====
export const mockKPIData: KPIData[] = [
  {
    id: 'revenue',
    title: 'Monthly Revenue',
    value: 124500,
    previousValue: 118200,
    trend: 'up',
    changeType: 'increase',
    change: 5.3,
    color: '#10B981',
    icon: '💰',
  },
  {
    id: 'users',
    title: 'Active Users',
    value: 8945,
    previousValue: 8234,
    trend: 'up',
    changeType: 'increase',
    change: 8.6,
    color: '#3B82F6',
    icon: '👥',
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: 3.2,
    previousValue: 2.8,
    trend: 'up',
    changeType: 'increase',
    change: 14.3,
    color: '#F59E0B',
    icon: '📈',
  },
  {
    id: 'orders',
    title: 'Total Orders',
    value: 1247,
    previousValue: 1389,
    trend: 'down',
    changeType: 'decrease',
    change: -10.2,
    color: '#EF4444',
    icon: '🛒',
  },
];

// ===== WEATHER DATA =====
export const mockWeatherData: WeatherData = {
  location: 'San Francisco, CA',
  temperature: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  windDirection: 'SW',
  pressure: 1013,
  visibility: 16,
  uvIndex: 6,
  icon: '⛅',
  forecast: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      date,
      high: Math.round(20 + Math.random() * 10),
      low: Math.round(10 + Math.random() * 8),
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      precipitation: Math.round(Math.random() * 100),
      icon: ['☀️', '☁️', '🌧️', '⛅'][Math.floor(Math.random() * 4)],
    };
  }),
};

// ===== TABLE DATA =====
export const mockTableData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@company.com',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2023-01-15',
    salary: 85000,
    performance: 92,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@company.com',
    department: 'Marketing',
    status: 'Active',
    joinDate: '2023-03-22',
    salary: 72000,
    performance: 88,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@company.com',
    department: 'Sales',
    status: 'Pending',
    joinDate: '2023-06-10',
    salary: 68000,
    performance: 85,
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    department: 'Design',
    status: 'Active',
    joinDate: '2022-11-08',
    salary: 75000,
    performance: 95,
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@company.com',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2023-02-14',
    salary: 92000,
    performance: 90,
  },
];

// ===== MAP DATA =====
export const mockMapMarkers: MapMarker[] = [
  {
    id: 'marker-1',
    latitude: 37.7749,
    longitude: -122.4194,
    title: 'San Francisco Office',
    description: 'Main headquarters',
    category: 'office',
    icon: '🏢',
    color: '#3B82F6',
  },
  {
    id: 'marker-2',
    latitude: 40.7128,
    longitude: -74.006,
    title: 'New York Office',
    description: 'East coast branch',
    category: 'office',
    icon: '🏢',
    color: '#10B981',
  },
  {
    id: 'marker-3',
    latitude: 34.0522,
    longitude: -118.2437,
    title: 'Los Angeles Office',
    description: 'West coast expansion',
    category: 'office',
    icon: '🏢',
    color: '#F59E0B',
  },
  {
    id: 'marker-4',
    latitude: 51.5074,
    longitude: -0.1278,
    title: 'London Office',
    description: 'European headquarters',
    category: 'office',
    icon: '🏢',
    color: '#EF4444',
  },
];

export const mockLocationData: LocationData[] = [
  {
    id: 'loc-1',
    name: 'Central Park Coffee',
    description: 'Cozy coffee shop with outdoor seating',
    address: '123 Park Avenue',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    postalCode: '10001',
    coordinates: { latitude: 40.7829, longitude: -73.9654 },
    category: 'restaurant',
    subcategory: 'coffee',
    rating: 4.5,
    reviewCount: 234,
    priceLevel: 2,
    isOpen: true,
    openingHours: ['Mon-Fri: 7:00-19:00', 'Sat-Sun: 8:00-20:00'],
    phone: '+1-555-0123',
    website: 'https://centralparkfoffee.com',
    features: ['wifi', 'outdoor-seating', 'takeout'],
    amenities: ['Free WiFi', 'Outdoor Seating', 'Takeout Available'],
    verified: true,
    distance: 0.3,
    lastUpdated: new Date(),
  },
  {
    id: 'loc-2',
    name: 'Tech Hub Coworking',
    description: 'Modern coworking space for tech professionals',
    address: '456 Innovation Drive',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    postalCode: '94105',
    coordinates: { latitude: 37.7849, longitude: -122.4094 },
    category: 'workspace',
    subcategory: 'coworking',
    rating: 4.8,
    reviewCount: 156,
    priceLevel: 3,
    isOpen: true,
    openingHours: ['Mon-Fri: 8:00-22:00', 'Sat-Sun: 9:00-18:00'],
    phone: '+1-555-0456',
    website: 'https://techhub.co',
    features: ['wifi', 'parking', 'meeting-rooms', '24-7'],
    amenities: ['High-Speed WiFi', 'Parking', 'Meeting Rooms', '24/7 Access'],
    verified: true,
    distance: 1.2,
    lastUpdated: new Date(),
  },
];

export const mockHeatmapData: HeatmapPoint[] = Array.from({ length: 100 }, () => ({
  latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
  longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
  weight: Math.random() * 100,
  intensity: Math.random(),
  category: ['traffic', 'events', 'business'][Math.floor(Math.random() * 3)],
  timestamp: new Date(Date.now() - Math.random() * 86400000 * 30),
}));

// ===== USER DATA =====
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@company.com',
    name: 'Admin User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    status: 'active',
    permissions: ['read', 'write', 'delete', 'admin'],
  },
  {
    id: 'user-2',
    email: 'manager@company.com',
    name: 'Manager User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
    role: 'manager',
    status: 'active',
    permissions: ['read', 'write'],
  },
  {
    id: 'user-3',
    email: 'viewer@company.com',
    name: 'Viewer User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
    role: 'viewer',
    status: 'active',
    permissions: ['read'],
  },
];

// ===== NOTIFICATION DATA =====
export const mockNotifications: NotificationHistoryItem[] = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'Export Complete',
    message: 'Your data export has been completed successfully.',
    duration: 4000,
    createdAt: new Date(Date.now() - 3600000),
    readAt: new Date(Date.now() - 3000000),
    metadata: { exportId: 'exp-123', fileSize: '2.5MB' },
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'Server Load High',
    message: 'Server CPU usage is at 85%. Consider scaling resources.',
    duration: 0,
    persistent: true,
    createdAt: new Date(Date.now() - 7200000),
    metadata: { serverId: 'srv-456', cpuUsage: 85 },
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'New Feature Available',
    message: 'Check out our new dashboard widgets!',
    duration: 6000,
    createdAt: new Date(Date.now() - 86400000),
    clickedAt: new Date(Date.now() - 86000000),
    metadata: { feature: 'widgets-v2' },
  },
  {
    id: 'notif-4',
    type: 'error',
    title: 'Payment Failed',
    message: 'Monthly subscription payment could not be processed.',
    duration: 0,
    persistent: true,
    createdAt: new Date(Date.now() - 172800000),
    metadata: { paymentId: 'pay-789', amount: 99.99 },
  },
];

// ===== CALENDAR DATA =====
export const mockCalendarEvents = [
  {
    id: 'event-1',
    title: 'Team Meeting',
    start: new Date(2024, 5, 15, 10, 0),
    end: new Date(2024, 5, 15, 11, 0),
    category: 'meeting',
    color: '#3B82F6',
    attendees: ['john@company.com', 'jane@company.com'],
  },
  {
    id: 'event-2',
    title: 'Product Launch',
    start: new Date(2024, 5, 20, 14, 0),
    end: new Date(2024, 5, 20, 16, 0),
    category: 'milestone',
    color: '#10B981',
    attendees: ['team@company.com'],
  },
  {
    id: 'event-3',
    title: 'Client Presentation',
    start: new Date(2024, 5, 25, 15, 30),
    end: new Date(2024, 5, 25, 16, 30),
    category: 'presentation',
    color: '#F59E0B',
    attendees: ['sales@company.com'],
  },
];

// ===== TREEMAP DATA =====
export const mockTreemapData: TreemapNode[] = [
  {
    id: 'tech',
    name: 'Technology',
    value: 45000,
    color: '#3B82F6',
    category: 'department',
    children: [
      { id: 'frontend', name: 'Frontend', value: 20000, color: '#60A5FA' },
      { id: 'backend', name: 'Backend', value: 15000, color: '#3B82F6' },
      { id: 'devops', name: 'DevOps', value: 10000, color: '#1D4ED8' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    value: 32000,
    color: '#10B981',
    category: 'department',
    children: [
      { id: 'enterprise', name: 'Enterprise', value: 18000, color: '#34D399' },
      { id: 'smb', name: 'SMB', value: 14000, color: '#10B981' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    value: 28000,
    color: '#F59E0B',
    category: 'department',
    children: [
      { id: 'digital', name: 'Digital', value: 16000, color: '#FBBF24' },
      { id: 'content', name: 'Content', value: 12000, color: '#F59E0B' },
    ],
  },
];

// ===== GAUGE DATA =====
export const mockGaugeSegments: GaugeSegment[] = [
  { min: 0, max: 25, color: '#EF4444', label: 'Poor' },
  { min: 25, max: 50, color: '#F59E0B', label: 'Fair' },
  { min: 50, max: 75, color: '#10B981', label: 'Good' },
  { min: 75, max: 100, color: '#3B82F6', label: 'Excellent' },
];

// ===== TIMELINE DATA =====
export const mockTimelineEvents = [
  {
    id: 'timeline-1',
    date: new Date('2024-01-15'),
    title: 'Project Started',
    description: 'Initial project kickoff and planning phase',
    type: 'milestone',
    color: '#3B82F6',
    icon: '🚀',
  },
  {
    id: 'timeline-2',
    date: new Date('2024-02-20'),
    title: 'First Sprint Complete',
    description: 'Completed first development sprint with core features',
    type: 'completion',
    color: '#10B981',
    icon: '✅',
  },
  {
    id: 'timeline-3',
    date: new Date('2024-03-10'),
    title: 'Beta Release',
    description: 'Released beta version to selected customers',
    type: 'release',
    color: '#F59E0B',
    icon: '🎯',
  },
  {
    id: 'timeline-4',
    date: new Date('2024-04-05'),
    title: 'Security Audit',
    description: 'Completed third-party security audit',
    type: 'security',
    color: '#8B5CF6',
    icon: '🔒',
  },
  {
    id: 'timeline-5',
    date: new Date('2024-05-15'),
    title: 'Public Launch',
    description: 'Official public launch with marketing campaign',
    type: 'launch',
    color: '#EF4444',
    icon: '🎉',
  },
];

// ===== FORM SAMPLE DATA =====
export const mockFormData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    nationality: 'US',
  },
  address: {
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'USA',
  },
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analytics: true,
    },
    display: {
      theme: 'light',
      language: 'en',
      timezone: 'America/Los_Angeles',
    },
  },
};

// ===== SELECT OPTIONS =====
export const mockSelectOptions = {
  countries: [
    { value: 'us', label: 'United States', icon: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', icon: '🇬🇧' },
    { value: 'ca', label: 'Canada', icon: '🇨🇦' },
    { value: 'de', label: 'Germany', icon: '🇩🇪' },
    { value: 'fr', label: 'France', icon: '🇫🇷' },
    { value: 'jp', label: 'Japan', icon: '🇯🇵' },
    { value: 'au', label: 'Australia', icon: '🇦🇺' },
    { value: 'br', label: 'Brazil', icon: '🇧🇷' },
  ],
  departments: [
    {
      value: 'engineering',
      label: 'Engineering',
      description: 'Software development and technical roles',
    },
    {
      value: 'marketing',
      label: 'Marketing',
      description: 'Brand, growth, and customer acquisition',
    },
    { value: 'sales', label: 'Sales', description: 'Revenue generation and client relations' },
    { value: 'design', label: 'Design', description: 'UI/UX and creative services' },
    {
      value: 'hr',
      label: 'Human Resources',
      description: 'People operations and talent management',
    },
    { value: 'finance', label: 'Finance', description: 'Financial planning and accounting' },
  ],
  categories: [
    { value: 'electronics', label: 'Electronics', group: 'Technology' },
    { value: 'computers', label: 'Computers', group: 'Technology' },
    { value: 'smartphones', label: 'Smartphones', group: 'Technology' },
    { value: 'clothing', label: 'Clothing', group: 'Fashion' },
    { value: 'shoes', label: 'Shoes', group: 'Fashion' },
    { value: 'accessories', label: 'Accessories', group: 'Fashion' },
    { value: 'books', label: 'Books', group: 'Education' },
    { value: 'courses', label: 'Online Courses', group: 'Education' },
  ],
};

// ===== EXPORT ALL MOCK DATA =====
export const mockData = {
  charts: {
    line: mockLineChartData,
    bar: mockBarChartData,
    pie: mockPieChartData,
    area: mockAreaChartData,
    scatter: mockScatterPlotData,
  },
  kpis: mockKPIData,
  weather: mockWeatherData,
  table: mockTableData,
  maps: {
    markers: mockMapMarkers,
    locations: mockLocationData,
    heatmap: mockHeatmapData,
  },
  users: mockUsers,
  notifications: mockNotifications,
  calendar: mockCalendarEvents,
  treemap: mockTreemapData,
  gauge: { segments: mockGaugeSegments, value: 78 },
  timeline: mockTimelineEvents,
  forms: {
    data: mockFormData,
    options: mockSelectOptions,
  },
};

export default mockData;
