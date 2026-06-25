export function SkeletonLoader({
  width = '100%',
  height = '1rem',
  radius = '0.25rem',
  count = 1,
  className = '',
}: {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={`${className} flex space-y-2`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`h-${typeof height === 'number' ? height : height.replace('rem', '').replace('px', '')} w-${typeof width === 'number' ? width : width.replace('rem', '').replace('px', '')} bg-slate-800/50 rounded-${radius} animate-pulse`}
        />
      ))}
    </div>
  );
}

// Skeleton variants for common UI elements
export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`${className} space-y-2`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={index}
          width={index === lines - 1 ? '70%' : '100%'}
          height="0.875rem"
          radius="0.25rem"
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = '2rem',
  className = '',
}: {
  size?: string | number;
  className?: string;
}) {
  return (
    <div
      className={`flex-shrink-0 h-${typeof size === 'number' ? size : size.replace('rem', '').replace('px', '')} w-${typeof size === 'number' ? size : size.replace('rem', '').replace('px', '')} animate-pulse rounded-full bg-slate-800/50 ${className}`}
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string } = {}) {
  return (
    <div className={`${className} rounded-xl border border-slate-800 bg-slate-900/50 p-4`}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <SkeletonAvatar size="3.5rem" />
          <div className="space-y-2">
            <SkeletonText lines={3} />
          </div>
        </div>
        <SkeletonLoader width="60%" height="1.5rem" radius="0.5rem" className="mt-2" />
        <SkeletonLoader width="40%" height="1rem" radius="0.25rem" className="mt-2" />
      </div>
    </div>
  );
}

export function SkeletonTableRow({ className = '' }: { className?: string } = {}) {
  return (
    <div className={`${className} flex items-center gap-4 py-3`}>
      <SkeletonAvatar size="2.5rem" />
      <div className="space-y-1">
        <SkeletonLoader width="60%" height="0.75rem" radius="0.125rem" />
        <SkeletonLoader width="40%" height="0.5rem" radius="0.125rem" className="mt-1" />
      </div>
      <SkeletonLoader width="20%" height="0.5rem" radius="0.125rem" />
      <SkeletonLoader width="15%" height="0.5rem" radius="0.125rem" />
      <SkeletonLoader width="15%" height="0.5rem" radius="0.125rem" />
      <SkeletonLoader width="10%" height="0.5rem" radius="0.125rem" />
    </div>
  );
}
