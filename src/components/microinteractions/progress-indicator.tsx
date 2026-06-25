import { Fragment } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ProgressIndicatorProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  status?: 'success' | 'error' | 'warning' | 'info';
}

export function ProgressIndicator({
  value = 0,
  label,
  showValue = true,
  size = 'md',
  className = '',
  status,
}: ProgressIndicatorProps) {
  // Determine color based on status or value
  const getColor = () => {
    if (status) {
      switch (status) {
        case 'success':
          return 'bg-green-500';
        case 'error':
          return 'bg-red-500';
        case 'warning':
          return 'bg-yellow-500';
        case 'info':
          return 'bg-blue-500';
        default:
          return 'bg-indigo-500';
      }
    }

    // Default color based on value
    if (value >= 90) return 'bg-green-500';
    if (value >= 70) return 'bg-blue-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sizeConfig: Record<string, { heightClass: string; textSize: string }> = {
    sm: { heightClass: 'h-1', textSize: 'text-xs' },
    md: { heightClass: 'h-1.5', textSize: 'text-sm' },
    lg: { heightClass: 'h-2', textSize: 'text-base' },
  };

  const { heightClass, textSize } = sizeConfig[size];
  const color = getColor();

  return (
    <div className={`${className} space-y-2`}>
      {label && (
        <div className="mb-1 flex items-start justify-between">
          <span className={`font-medium ${textSize} text-slate-100`}>{label}</span>
          {showValue && <span className={`font-medium ${textSize} text-slate-400`}>{value}%</span>}
        </div>
      )}
      <div className={`w-full ${heightClass} overflow-hidden rounded-full bg-slate-800/50`}>
        <div
          className={`${color} ${heightClass} transition-all duration-500 ease-in-out`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showValue && !label && (
        <div className={`text-center ${textSize} font-medium text-slate-400`}>{value}%</div>
      )}
    </div>
  );
}

// Circular progress indicator
interface CircularProgressProps {
  value: number; // 0-100
  label?: string;
  size?: number; // diameter in pixels
  className?: string;
  status?: 'success' | 'error' | 'warning' | 'info';
}

export function CircularProgress({
  value = 0,
  label,
  size = 80,
  className = '',
  status,
}: CircularProgressProps) {
  // Determine color based on status or value
  const getColor = () => {
    if (status) {
      switch (status) {
        case 'success':
          return 'text-green-500';
        case 'error':
          return 'text-red-500';
        case 'warning':
          return 'text-yellow-500';
        case 'info':
          return 'text-blue-500';
        default:
          return 'text-indigo-500';
      }
    }

    // Default color based on value
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-blue-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const color = getColor();
  const radius = (size - 4) / 2; // Account for stroke width
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`${className} flex items-center gap-4`}>
      <svg width={size} height={size} className="flex-shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="fill-none stroke-slate-800/50 stroke-[3]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${color} stroke-dasharray={[circumference, circumference]} stroke-dashoffset={offset} fill-none stroke-[3] transition-all duration-1000 ease-in-out`}
        />
      </svg>
      {label && (
        <div className="space-y-1">
          <p className={`text-base font-medium text-slate-100`}>{label}</p>
          {value !== undefined && <p className={`text-sm font-bold ${color}`}>{value}%</p>}
        </div>
      )}
    </div>
  );
}

// Skeleton progress indicator for loading states
export function SkeletonProgressIndicator({ className = '' }: { className?: string }) {
  return (
    <div className={`${className} space-y-2`}>
      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-800/50">
        <div className="h-4 w-[30%] animate-pulse bg-slate-600/50" />
      </div>
      <div className="text-center text-xs text-slate-400">Loading...</div>
    </div>
  );
}

// Progress steps indicator
interface ProgressStep {
  label: string;
  completed: boolean;
  current?: boolean;
}

export function ProgressSteps({
  steps,
  className = '',
}: {
  steps: ProgressStep[];
  className?: string;
}) {
  return (
    <div className={`${className} space-y-4`}>
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  step.current ? 'bg-indigo-500' : step.completed ? 'bg-green-500' : 'bg-slate-500'
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  step.current
                    ? 'text-indigo-400'
                    : step.completed
                      ? 'text-green-400'
                      : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && <div className="h-1 w-1 bg-slate-800/50" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

// Success state indicator
export function SuccessIndicator({
  message = 'Success!',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={`${className} flex items-center gap-2 rounded-xl border border-green-800/50 bg-green-900/20 p-3`}
    >
      <CheckCircle className="h-4 w-4 text-green-400" />
      <span className="text-sm font-medium text-green-400">{message}</span>
    </div>
  );
}

// Error state indicator
export function ErrorIndicator({
  message = 'Error occurred',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={`${className} flex items-center gap-2 rounded-xl border border-red-800/50 bg-red-900/20 p-3`}
    >
      <X className="h-4 w-4 text-red-400" />
      <span className="text-sm font-medium text-red-400">{message}</span>
    </div>
  );
}

// Warning state indicator
export function WarningIndicator({
  message = 'Warning',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={`${className} flex items-center gap-2 rounded-xl border border-yellow-800/50 bg-yellow-900/20 p-3`}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400">
        !
      </span>
      <span className="text-sm font-medium text-yellow-400">{message}</span>
    </div>
  );
}

// Info state indicator
export function InfoIndicator({
  message = 'Information',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={`${className} flex items-center gap-2 rounded-xl border border-blue-800/50 bg-blue-900/20 p-3`}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
        i
      </span>
      <span className="text-sm font-medium text-blue-400">{message}</span>
    </div>
  );
}
