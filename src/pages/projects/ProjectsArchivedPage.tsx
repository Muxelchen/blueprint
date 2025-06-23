import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Calendar, CheckCircle, Search, Filter } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const ProjectsArchivedPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');

  const archivedProjects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      completedDate: '2023-12-15',
      duration: '8 months',
      team: ['Alice', 'Bob', 'Charlie', 'Diana'],
      budget: '$120,000',
      actualCost: '$115,000',
      status: 'Completed',
      outcome: 'Success'
    },
    {
      id: 2,
      name: 'Customer Portal',
      completedDate: '2023-11-20',
      duration: '4 months',
      team: ['Eve', 'Frank'],
      budget: '$45,000',
      actualCost: '$48,000',
      status: 'Completed',
      outcome: 'Over Budget'
    },
    {
      id: 3,
      name: 'Legacy System Migration',
      completedDate: '2023-10-30',
      duration: '12 months',
      team: ['Grace', 'Henry', 'Ivy', 'Jack', 'Kate'],
      budget: '$200,000',
      actualCost: '$185,000',
      status: 'Completed',
      outcome: 'Success'
    },
    {
      id: 4,
      name: 'Mobile Optimization',
      completedDate: '2023-09-10',
      duration: '3 months',
      team: ['Liam', 'Maya'],
      budget: '$30,000',
      actualCost: '$28,500',
      status: 'Cancelled',
      outcome: 'Cancelled'
    }
  ];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Over Budget': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Archived Projects
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Review completed and cancelled projects
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search archived projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {archivedProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  project.status === 'Completed' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {project.status === 'Completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Archive className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Completed: {new Date(project.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Duration: {project.duration}
                    </span>
                  </div>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOutcomeColor(project.outcome)}`}>
                {project.outcome}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Team */}
              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Team Members ({project.team.length})
                </h4>
                <div className="flex -space-x-2">
                  {project.team.slice(0, 4).map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white dark:border-gray-800"
                    >
                      {member.charAt(0)}
                    </div>
                  ))}
                  {project.team.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold border-2 border-white dark:border-gray-800">
                      +{project.team.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Budget vs Actual
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Budget:</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.budget}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actual:</span>
                    <span className={`text-sm font-semibold ${
                      parseFloat(project.actualCost.replace('$', '').replace(',', '')) <= parseFloat(project.budget.replace('$', '').replace(',', ''))
                        ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {project.actualCost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Final Status
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'Completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsArchivedPage; 