import { useState, useEffect } from 'react';

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameCount: 0,
    lastTime: 0,
    renderCount: 0,
    loadTime: 0,
    interactionCount: 0
  });

  // Track FPS
  useEffect(() => {
    let lastTimestamp = 0;
    let frameCount = 0;
    let fps = 0;

    const animate = (timestamp: number) => {
      if (lastTimestamp !== 0) {
        const delta = timestamp - lastTimestamp;
        fps = Math.round(1000 / delta);
      }
      lastTimestamp = timestamp;
      frameCount++;

      setMetrics(prev => ({
        ...prev,
        fps,
        frameCount
      }));

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      // Cleanup animation frame if needed
    };
  }, []);

  // Track render counts
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  }, []); // This will run on every render

  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      renderCount
    }));
  }, [renderCount]);

  // Track load time
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        loadTime: endTime - startTime
      }));
    };
  }, []);

  // Track interactions
  const [interactionCount, setInteractionCount] = useState(0);

  const trackInteraction = useCallback(() => {
    setInteractionCount(prev => prev + 1);
    setMetrics(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1
    }));
  }, []);

  return {
    metrics,
    trackInteraction,
    reset: () => setMetrics({
      fps: 0,
      frameCount: 0,
      lastTime: 0,
      renderCount: 0,
      loadTime: 0,
      interactionCount: 0
    })
  };
}

/**
 * Lazy load image component
 */
export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  [key: string]: any;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative w-full h-[${height || 'auto'}] overflow-hidden`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
          <div className="h-4 w-4 animate-pulse rounded-full bg-indigo-500" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} ${hasError ? 'hidden' : ''}`}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        {...props}
      />

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
          <span className="text-sm text-slate-400">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

/**
 * Lazy load component
 */
interface LazyComponentProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyComponent({
  children,
  threshold = 0.1,
  rootMargin = '0px',
  className = '',
  ...props
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold,
      rootMargin
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={`${className} overflow-hidden`}>
      {isVisible ? children : (
        <div className="min-h-[100px] flex items-center justify-center bg-slate-900/50">
          <SkeletonLoader width="100%" height="100%" />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton loader for lazy components
 */
function SkeletonLoader({
  width = '100%',
  height = '100%',
  className = ''
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <div className={`${className} w-[${typeof width === 'number' ? width : width.replace('rem', '').replace('px', '')}] h-[${typeof height === 'number' ? height : height.replace('rem', '').replace('px', '')}] bg-slate-800/50 rounded animate-pulse`} />
  );
}

/**
 * Virtualized list for large datasets
 */
export function VirtualizedList({
  items,
  itemHeight,
  renderItem,
  className = ''
}: {
  items: any[];
  itemHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [viewportSize, setViewportSize] = useState({ height: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);

  // Calculate visible items
  const visibleItemCount = Math.ceil(viewportSize.height / itemHeight) + 2; // Add buffer
  const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - 1);
  const endIndex = Math.min(items.length, startIndex + visibleItemCount + 1);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateViewportSize = () => {
      setViewportSize({
        height: element.clientHeight,
        width: element.clientWidth
      });
    };

    const handleScroll = () => {
      setScrollOffset(element.scrollTop);
    };

    // Initial setup
    updateViewportSize();

    // Add event listeners
    element.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateViewportSize);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateViewportSize);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} w-full overflow-y-auto bg-slate-900/50`}
      style={{ height: '100%' }}
    >
      {/* Padding for scroll position */}
      <div
        style={{
          height: `${startIndex * itemHeight}px`,
          width: '100%'
        }}
      />

      {/* Visible items */}
      <div className="flex flex-col">
        {items.slice(startIndex, endIndex).map((item, index) => (
          <div
            key={`${item.id || index}-${startIndex + index}`}
            style={{
              height: `${itemHeight}px`,
              width: '100%'
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>

      {/* Padding for scroll position */}
      <div
        style={{
          height: `${(items.length - endIndex) * itemHeight}px`,
          width: '100%'
        }}
      />
    </div>
  );
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    clearTimeout(timeout as NodeJS.Timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> {
  let inThrottle: boolean = false;
  let lastCall: number = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();

    if (!inThrottle) {
      func(...args);
      lastCall = now;
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export {
  usePerformanceMonitor,
  LazyImage,
  LazyComponent,
  VirtualizedList,
  debounce,
  throttle
};