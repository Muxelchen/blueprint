import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Zap, Target, Activity } from 'lucide-react';

interface ProgressBarProps {
  value?: number;
  max?: number;
  title?: string;
  variant?: 'default' | 'gradient' | 'striped' | 'animated' | 'wave' | 'glow' | 'particles';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showPercentage?: boolean;
  animate?: boolean;
}

type VariantType = 'default' | 'gradient' | 'striped' | 'animated' | 'wave' | 'glow' | 'particles';

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 61.9,
  max = 100,
  title = 'Progress Animations Showcase',
  variant = 'default',
  size = 'md',
  color = 'blue',
  showPercentage = true,
  animate = true,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [mainAnimatedValue, setMainAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const percentage = Math.min((value / max) * 100, 100);

  // Enhanced animation with spring effect for main progress bar
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        const spring = (t: number) => {
          const tension = 0.1;
          const friction = 0.8;
          return 1 - Math.exp(-t * tension) * Math.cos(t * friction);
        };

        let startTime: number;
        const animateProgress = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const duration = 2000;
          const progress = Math.min(elapsed / duration, 1);

          const easedProgress = spring(progress * 6);
          setMainAnimatedValue(percentage * easedProgress);

          if (progress < 1) {
            requestAnimationFrame(animateProgress);
          }
        };

        requestAnimationFrame(animateProgress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setMainAnimatedValue(percentage);
    }
  }, [percentage, animate]);

  // Enhanced animation with spring effect for variant demos
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        const spring = (t: number) => {
          const tension = 0.1;
          const friction = 0.8;
          return 1 - Math.exp(-t * tension) * Math.cos(t * friction);
        };

        let startTime: number;
        const animateProgress = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const duration = 2000;
          const progress = Math.min(elapsed / duration, 1);

          const easedProgress = spring(progress * 6);
          setAnimatedValue(percentage * easedProgress);

          if (progress < 1) {
            requestAnimationFrame(animateProgress);
          }
        };

        requestAnimationFrame(animateProgress);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animate]);

  // Particle animation effect
  useEffect(() => {
    let animationId: number;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resizeCanvas = () => {
        if (progressRef.current) {
          canvas.width = progressRef.current.offsetWidth;
          canvas.height = progressRef.current.offsetHeight;
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

      const addParticle = () => {
        const progressWidth = (animatedValue / 100) * canvas.width;
        if (progressWidth > 0) {
          particles.push({
            x: Math.random() * progressWidth,
            y: canvas.height / 2 + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2 - 1,
            life: 1,
          });
        }
      };

      const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.2 && particles.length < 15 && animatedValue > 0) {
          addParticle();
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.globalAlpha = p.life;
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
          ctx.fill();
        }

        animationId = requestAnimationFrame(animateParticles);
      };

      animateParticles();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [animatedValue]);

  const sizeClasses = {
    sm: 'h-3',
    md: 'h-6',
    lg: 'h-8',
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  const gradientClasses = {
    blue: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 via-green-500 to-green-600',
    red: 'bg-gradient-to-r from-red-400 via-red-500 to-red-600',
    yellow: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600',
    purple: 'bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600',
  };

  // Animation variants showcase data
  const animationVariants = [
    {
      name: 'Wave Animation',
      variant: 'wave' as VariantType,
      color: 'blue' as const,
      description: 'Flowing wave effect with sliding patterns',
    },
    {
      name: 'Glow Effect',
      variant: 'glow' as VariantType,
      color: 'purple' as const,
      description: 'Pulsing glow with shimmer animation',
    },
    {
      name: 'Particles',
      variant: 'particles' as VariantType,
      color: 'green' as const,
      description: 'Dynamic particle system with physics',
    },
    {
      name: 'Gradient Flow',
      variant: 'gradient' as VariantType,
      color: 'red' as const,
      description: 'Smooth gradient transitions',
    },
  ];

  const mockProgressData = [
    { label: 'CPU Usage', value: 73, color: 'blue' as const, icon: Activity, trend: '+5%' },
    { label: 'Memory', value: 45, color: 'green' as const, icon: Target, trend: '-2%' },
    { label: 'Storage', value: 89, color: 'red' as const, icon: TrendingUp, trend: '+12%' },
    { label: 'Network', value: 32, color: 'yellow' as const, icon: Zap, trend: '+8%' },
    { label: 'GPU', value: 67, color: 'purple' as const, icon: Activity, trend: '+3%' },
  ];

  const renderProgressBar = (
    variantType: VariantType,
    progressColor: keyof typeof colorClasses,
    progressValue: number
  ) => {
    const baseClass = `${sizeClasses[size]} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`;

    const getProgressClass = () => {
      switch (variantType) {
        case 'gradient':
          return `${baseClass} ${gradientClasses[progressColor]}`;
        case 'glow':
          return `${baseClass} ${colorClasses[progressColor]}`;
        case 'wave':
          return `${baseClass} ${colorClasses[progressColor]}`;
        case 'striped':
        case 'animated':
          return `${baseClass} ${colorClasses[progressColor]}`;
        default:
          return `${baseClass} ${colorClasses[progressColor]}`;
      }
    };

    return (
      <div
        className={getProgressClass()}
        style={{
          width: `${progressValue}%`,
          filter: variantType === 'glow' ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))' : 'none',
        }}
      >
        {/* Wave Animation */}
        {variantType === 'wave' && (
          <>
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                animation: 'wave 2s ease-in-out infinite',
              }}
            />
            <div
              className="absolute top-0 left-0 w-full h-full opacity-30"
              style={{
                background: `repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.4) 20px, rgba(255,255,255,0.4) 40px)`,
                animation: 'slide 1.5s linear infinite',
              }}
            />
          </>
        )}

        {/* Glow Effect */}
        {variantType === 'glow' && (
          <>
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
              style={{ animation: 'shimmer 2s ease-in-out infinite' }}
            />
            <div
              className="absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.5)',
                animation: 'glow-pulse 1.5s ease-in-out infinite',
              }}
            />
          </>
        )}

        {/* Hover Effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-white opacity-20 transition-opacity duration-300" />
        )}
      </div>
    );
  };

  return (
    <div className="bg-surface border border-border p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <div className="flex items-center space-x-2">
          {showPercentage && (
            <span className="text-lg font-bold text-text-primary transition-all duration-300">
              {mainAnimatedValue.toFixed(1)}%
            </span>
          )}
          <TrendingUp className="w-4 h-4 text-success" />
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-surface-secondary rounded-full h-8 relative overflow-hidden">
          <div
            className="h-8 bg-gradient-to-r from-accent via-accent to-accent-hover rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
            style={{ width: `${mainAnimatedValue}%` }}
          >
            {/* Main bar wave effect */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                animation: 'wave 2s ease-in-out infinite',
              }}
            />
            {/* Main bar shimmer */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
              style={{ animation: 'shimmer 3s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>

      {/* Animation Variants Showcase */}
      <div className="space-y-6 mb-8">
        <h4 className="text-md font-medium text-text-primary">Animation Variants</h4>
        {animationVariants.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-text-secondary">{item.name}</span>
                <p className="text-xs text-text-secondary">{item.description}</p>
              </div>
              <span className="text-sm font-bold text-text-primary">{60 + index * 10}%</span>
            </div>
            <div
              className="w-full bg-surface-secondary rounded-full relative overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {renderProgressBar(item.variant, item.color, 60 + index * 10)}

              {/* Particles Canvas for particles variant */}
              {item.variant === 'particles' && (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 10 }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* System Metrics */}
      <div className="space-y-4 mb-8">
        <h4 className="text-md font-medium text-text-primary flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          System Metrics
        </h4>
        {mockProgressData.map((item, index) => {
          const itemPercentage = (item.value / 100) * 100;
          const Icon = item.icon;
          return (
            <div key={index} className="group p-3 rounded-lg hover:bg-surface-hover transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-success font-medium">{item.trend}</span>
                  <span className="text-sm font-bold text-text-primary">{item.value}%</span>
                </div>
              </div>
              <div className="w-full bg-surface-secondary rounded-full h-4 relative overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ease-out ${colorClasses[item.color]} relative overflow-hidden`}
                  style={{
                    width: `${animate ? itemPercentage : 0}%`,
                    animationDelay: `${index * 200}ms`,
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{
                      animation: `shine 3s ease-in-out infinite ${index * 0.5}s`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Circular Progress */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-text-primary mb-4">Circular Progress</h4>
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="var(--color-surface-secondary)" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="var(--color-accent)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - animatedValue / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-text-primary">{percentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-accent/10 p-3 rounded-lg">
          <div className="text-2xl font-bold text-accent">{percentage.toFixed(1)}%</div>
          <div className="text-xs text-accent">Current</div>
        </div>
        <div className="bg-success/10 p-3 rounded-lg">
          <div className="text-2xl font-bold text-success">{max}</div>
          <div className="text-xs text-success">Target</div>
        </div>
        <div className="bg-warning/10 p-3 rounded-lg">
          <div className="text-2xl font-bold text-warning">{(max - value).toFixed(0)}</div>
          <div className="text-xs text-warning">Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
