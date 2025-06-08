import React, { useState, useEffect } from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle, Eye, Lock } from 'lucide-react';

interface ProtectionStatus {
  isActive: boolean;
  violations: number;
  lastCheck: string;
  protectedFiles: number;
  monitoredComponents: number;
}

export const AIProtectionDashboard: React.FC = () => {
  const [status, setStatus] = useState<ProtectionStatus>({
    isActive: true,
    violations: 0,
    lastCheck: new Date().toLocaleString('de-DE'),
    protectedFiles: 247,
    monitoredComponents: 89
  });

  const [activityLog, setActivityLog] = useState([
    { time: '14:32:15', action: 'File integrity check', status: 'passed', file: 'ComponentRegistry.ts' },
    { time: '14:31:42', action: 'Template validation', status: 'passed', file: 'DashboardTemplate.tsx' },
    { time: '14:30:18', action: 'Code pattern scan', status: 'passed', file: 'useAnalytics.ts' },
    { time: '14:29:55', action: 'Export validation', status: 'passed', file: 'ExportFunctions.tsx' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastCheck: new Date().toLocaleString('de-DE')
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const StatusCard = ({ icon: Icon, title, value, color, description }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">AI Protection System</h1>
            <p className="text-blue-100">Real-time monitoring and security status</p>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          icon={status.isActive ? CheckCircle : AlertTriangle}
          title="Protection Status"
          value={status.isActive ? "ACTIVE" : "INACTIVE"}
          color={status.isActive ? "bg-green-500" : "bg-red-500"}
          description="Real-time protection monitoring"
        />
        
        <StatusCard
          icon={AlertTriangle}
          title="Violations"
          value={status.violations}
          color="bg-yellow-500"
          description="Security violations detected"
        />
        
        <StatusCard
          icon={Eye}
          title="Protected Files"
          value={status.protectedFiles}
          color="bg-blue-500"
          description="Files under active monitoring"
        />
        
        <StatusCard
          icon={Lock}
          title="Components"
          value={status.monitoredComponents}
          color="bg-purple-500"
          description="Monitored React components"
        />
      </div>

      {/* Activity Monitor */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Real-time Activity Log
            </h2>
            <span className="text-sm text-gray-500">
              Last updated: {status.lastCheck}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {activityLog.map((log, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-gray-500">{log.time}</span>
                  <span className="text-sm text-gray-700">{log.action}</span>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">{log.file}</code>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 ml-1">PASSED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protection Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Protections</h3>
          <div className="space-y-3">
            {[
              'File Integrity Monitoring',
              'Code Pattern Validation',
              'Template Safety Checks',
              'Component Verification',
              'Export Control System',
              'Real-time Activity Tracking'
            ].map((protection, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">{protection}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Commands</h3>
          <div className="space-y-2">
            <code className="block bg-gray-100 p-2 rounded text-sm">blueprint protect</code>
            <code className="block bg-gray-100 p-2 rounded text-sm">blueprint security-scan</code>
            <code className="block bg-gray-100 p-2 rounded text-sm">blueprint audit</code>
            <code className="block bg-gray-100 p-2 rounded text-sm">blueprint dev-check</code>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Use these CLI commands to interact with the protection system
          </p>
        </div>
      </div>
    </div>
  );
};