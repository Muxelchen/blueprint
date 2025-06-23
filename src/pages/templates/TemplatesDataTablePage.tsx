import React from 'react';
import { motion } from 'framer-motion';
import { DataTableTemplate } from '../../templates/DataTableTemplate';

const TemplatesDataTablePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      <DataTableTemplate />
    </motion.div>
  );
};

export default TemplatesDataTablePage; 