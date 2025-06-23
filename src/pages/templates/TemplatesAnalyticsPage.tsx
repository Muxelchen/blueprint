import React from 'react';
import { motion } from 'framer-motion';
import { AnalyticsTemplate } from '../../templates/AnalyticsTemplate';

const TemplatesAnalyticsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      <AnalyticsTemplate />
    </motion.div>
  );
};

export default TemplatesAnalyticsPage; 