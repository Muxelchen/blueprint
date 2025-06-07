import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Button from '../buttons/Button';

export interface Step {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  optional?: boolean;
  validate?: () => boolean | Promise<boolean>;
  icon?: React.ReactNode;
}

export interface StepperProps {
  steps: Step[];
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'simple' | 'circles' | 'progress';
  allowClickNavigation?: boolean;
  showStepNumbers?: boolean;
  className?: string;
  onStepChange?: (stepIndex: number, step: Step) => void;
  onComplete?: () => void;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep = 0,
  orientation = 'horizontal',
  variant = 'default',
  allowClickNavigation = false,
  showStepNumbers = true,
  className = '',
  onStepChange,
  onComplete,
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Set<number>>(new Set());
  const [isValidating, setIsValidating] = useState(false);

  const handleStepClick = (stepIndex: number) => {
    if (!allowClickNavigation) return;
    if (stepIndex <= Math.max(...completedSteps, activeStep)) {
      setActiveStep(stepIndex);
      onStepChange?.(stepIndex, steps[stepIndex]);
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepData = steps[activeStep];
    if (!currentStepData.validate) return true;

    setIsValidating(true);
    try {
      const isValid = await currentStepData.validate();
      const newErrors = new Set(validationErrors);

      if (isValid) {
        newErrors.delete(activeStep);
      } else {
        newErrors.add(activeStep);
      }

      setValidationErrors(newErrors);
      setIsValidating(false);
      return isValid;
    } catch (error) {
      // Always mark step as invalid if validation throws an exception
      const newErrors = new Set(validationErrors);
      newErrors.add(activeStep);
      setValidationErrors(newErrors);

      console.error(`Error validating step ${activeStep}:`, error);
      setIsValidating(false);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (isValid) {
      const newCompleted = new Set(completedSteps);
      newCompleted.add(activeStep);
      setCompletedSteps(newCompleted);

      if (activeStep < steps.length - 1) {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
        onStepChange?.(nextStep, steps[nextStep]);
      } else {
        onComplete?.();
      }
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      onStepChange?.(prevStep, steps[prevStep]);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === activeStep) return 'active';
    if (validationErrors.has(stepIndex)) return 'error';
    return 'pending';
  };

  const getStepClasses = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);

    const baseClasses = 'step transition-all duration-200';
    const statusClasses = {
      completed: 'step-completed',
      active: 'step-active',
      error: 'step-error',
      pending: 'step-pending',
    };

    const clickableClass =
      allowClickNavigation && stepIndex <= Math.max(...completedSteps, activeStep)
        ? 'cursor-pointer hover:opacity-80'
        : '';

    return `${baseClasses} ${statusClasses[status]} ${clickableClass}`;
  };

  const renderStepIndicator = (step: Step, stepIndex: number) => {
    const status = getStepStatus(stepIndex);

    const indicatorClasses = {
      default: {
        completed: 'bg-green-600 text-white border-green-600',
        active: 'bg-blue-600 text-white border-blue-600',
        error: 'bg-red-600 text-white border-red-600',
        pending: 'bg-white text-gray-500 border-gray-300',
      },
      simple: {
        completed: 'bg-green-100 text-green-600 border-green-300',
        active: 'bg-blue-100 text-blue-600 border-blue-300',
        error: 'bg-red-100 text-red-600 border-red-300',
        pending: 'bg-gray-100 text-gray-400 border-gray-300',
      },
      circles: {
        completed: 'bg-green-500 text-white',
        active: 'bg-blue-500 text-white',
        error: 'bg-red-500 text-white',
        pending: 'bg-gray-300 text-gray-600',
      },
      progress: {
        completed: 'bg-green-600 text-white',
        active: 'bg-blue-600 text-white',
        error: 'bg-red-600 text-white',
        pending: 'bg-gray-300 text-gray-600',
      },
    };

    const sizeClasses = variant === 'circles' ? 'w-8 h-8' : 'w-10 h-10';
    const roundedClasses = variant === 'circles' ? 'rounded-full' : 'rounded-lg';
    const borderClasses = variant !== 'circles' ? 'border-2' : '';

    return (
      <div
        className={`
          ${sizeClasses} ${roundedClasses} ${borderClasses}
          flex items-center justify-center font-semibold text-sm
          ${indicatorClasses[variant][status]}
        `}
      >
        {status === 'completed' ? (
          <Check className="w-4 h-4" />
        ) : status === 'error' ? (
          <AlertCircle className="w-4 h-4" />
        ) : step.icon ? (
          <span className="w-4 h-4">{step.icon}</span>
        ) : showStepNumbers ? (
          stepIndex + 1
        ) : null}
      </div>
    );
  };

  const renderStepContent = (step: Step, stepIndex: number) => (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-gray-900">{step.title}</h3>
        {step.optional && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Optional</span>
        )}
      </div>
      {step.description && <p className="text-sm text-gray-600">{step.description}</p>}
      {validationErrors.has(stepIndex) && (
        <p className="text-sm text-red-600 mt-1">Please complete this step</p>
      )}
    </div>
  );

  const renderConnector = (stepIndex: number) => {
    if (stepIndex === steps.length - 1) return null;

    const isCompleted = completedSteps.has(stepIndex);
    const connectorClass = isCompleted ? 'bg-green-600' : 'bg-gray-300';

    if (orientation === 'horizontal') {
      return <div className={`flex-1 h-0.5 ${connectorClass} mx-2`} />;
    } else {
      return <div className={`w-0.5 h-8 ${connectorClass} ml-5 my-1`} />;
    }
  };

  const renderHorizontalStepper = () => (
    <div className="flex items-center w-full">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`flex items-center ${getStepClasses(index)}`}
            onClick={() => handleStepClick(index)}
          >
            {renderStepIndicator(step, index)}
            <div className="ml-3">
              <div className="font-medium text-sm">{step.title}</div>
              {step.description && <div className="text-xs text-gray-500">{step.description}</div>}
            </div>
          </div>
          {renderConnector(index)}
        </React.Fragment>
      ))}
    </div>
  );

  const renderVerticalStepper = () => (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={step.id}>
          <div
            className={`flex items-start ${getStepClasses(index)}`}
            onClick={() => handleStepClick(index)}
          >
            {renderStepIndicator(step, index)}
            <div className="ml-4 flex-1">{renderStepContent(step, index)}</div>
          </div>
          {renderConnector(index)}
        </div>
      ))}
    </div>
  );

  const renderProgressBar = () => {
    const progress =
      ((completedSteps.size + (getStepStatus(activeStep) === 'active' ? 0.5 : 0)) / steps.length) *
      100;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div className={`stepper ${className}`}>
      {variant === 'progress' && renderProgressBar()}

      {/* Step Navigation */}
      <div className="step-navigation mb-8">
        {orientation === 'horizontal' ? renderHorizontalStepper() : renderVerticalStepper()}
      </div>

      {/* Current Step Content */}
      <div className="step-content mb-8">
        <div className="bg-white rounded-lg border p-6">{steps[activeStep]?.content}</div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={activeStep === 0}
          leftIcon={<ChevronLeft />}
        >
          Previous
        </Button>

        <div className="text-sm text-gray-500">
          Step {activeStep + 1} of {steps.length}
        </div>

        <Button
          variant="primary"
          onClick={handleNext}
          isLoading={isValidating}
          rightIcon={activeStep === steps.length - 1 ? undefined : <ChevronRight />}
        >
          {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

// Example usage with mock data
export const ExampleStepper: React.FC = () => {
  const [formData, setFormData] = useState({
    personalInfo: { name: '', email: '' },
    preferences: { notifications: false, theme: 'light' },
    review: { confirmed: false },
  });

  const steps: Step[] = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Enter your basic details',
      validate: () => {
        return (
          formData.personalInfo.name.trim() !== '' && formData.personalInfo.email.trim() !== ''
        );
      },
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.personalInfo.name}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, name: e.target.value },
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.personalInfo.email}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value },
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      optional: true,
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Set Your Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email notifications</label>
              <input
                type="checkbox"
                checked={formData.preferences.notifications}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, notifications: e.target.checked },
                  }))
                }
                className="rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                value={formData.preferences.theme}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: e.target.value },
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'review',
      title: 'Review & Confirm',
      description: 'Review your information',
      validate: () => formData.review.confirmed,
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Review Your Information</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <h3 className="font-semibold">Personal Information</h3>
              <p className="text-sm text-gray-600">Name: {formData.personalInfo.name}</p>
              <p className="text-sm text-gray-600">Email: {formData.personalInfo.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Preferences</h3>
              <p className="text-sm text-gray-600">
                Notifications: {formData.preferences.notifications ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-gray-600">Theme: {formData.preferences.theme}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confirm"
              checked={formData.review.confirmed}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  review: { confirmed: e.target.checked },
                }))
              }
            />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              I confirm that the information above is correct
            </label>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Horizontal Stepper (Default)</h3>
        <Stepper
          steps={steps}
          orientation="horizontal"
          allowClickNavigation={true}
          onStepChange={(stepIndex, step) => console.log('Step changed:', stepIndex, step.title)}
          onComplete={() => {
            console.log('Stepper completed!', formData);
            alert('Form completed successfully!');
          }}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Vertical Stepper (Simple)</h3>
        <Stepper
          steps={steps.slice(0, 2)}
          orientation="vertical"
          variant="simple"
          allowClickNavigation={false}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Progress Bar Stepper</h3>
        <Stepper
          steps={steps}
          variant="progress"
          showStepNumbers={false}
          allowClickNavigation={true}
        />
      </div>
    </div>
  );
};

export default Stepper;
