import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, Search, Filter, MoreHorizontal, Calendar, Users, Star, GitBranch, Activity } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

// Mock project data
const mockProjects = [
  {
    id: '1',
    name: 'Blueprint Dashboard',
    description: 'Modern React dashboard with advanced components',
    status: 'active',
    progress: 85,
    team: ['Alice', 'Bob', 'Charlie'],
    dueDate: new Date('2024-04-15'),
    tags: ['React', 'TypeScript', 'Tailwind'],
    priority: 'high',
    lastUpdate: new Date('2024-03-10'),
  },
  {
    id: '2',
    name: 'E-commerce Platform',
    description: 'Full-stack online shopping platform',
    status: 'in-progress',
    progress: 65,
    team: ['David', 'Eva', 'Frank'],
    dueDate: new Date('2024-05-20'),
    tags: ['Next.js', 'MongoDB', 'Stripe'],
    priority: 'medium',
    lastUpdate: new Date('2024-03-08'),
  },
  {
    id: '3',
    name: 'Mobile App',
    description: 'Cross-platform mobile application',
    status: 'planning',
    progress: 25,
    team: ['Grace', 'Henry'],
    dueDate: new Date('2024-06-30'),
    tags: ['React Native', 'Firebase'],
    priority: 'low',
    lastUpdate: new Date('2024-03-05'),
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const priorityColors = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const ProjectsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Projects
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Manage and track your projects
            </p>
          </div>
          
          <button className="btn-primary">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          />
        </div>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-primary-500`}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="in-progress">In Progress</option>
          <option value="planning">Planning</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
          >
            {/* Project header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {project.name}
                </h3>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {project.description}
                </p>
              </div>
              <button className={`p-1 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Status and Priority */}
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[project.status as keyof typeof statusColors]
              }`}>
                {project.status.replace('-', ' ')}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                priorityColors[project.priority as keyof typeof priorityColors]
              }`}>
                {project.priority} priority
              </span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Progress
                </span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {project.progress}%
                </span>
              </div>
              <div className={`w-full bg-gray-200 rounded-full h-2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs rounded ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className={`w-4 h-4 mr-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {project.team.length}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 mr-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {project.dueDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Activity className={`w-4 h-4 mr-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {project.lastUpdate.toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderPlus className={`w-12 h-12 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            No projects found
          </h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Try adjusting your search criteria or create a new project.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectsPage; 