import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for handling hover states with delay to prevent flickering
 */
export function useHoverDelay({
  delayOn = 100,
  delayOff = 300,
}: {
  delayOn?: number;
  delayOff?: number;
} = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setIsHovered(true), delayOn);
  }, [delayOn]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setIsHovered(false), delayOff);
  }, [delayOff]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isHovered, handleMouseEnter, handleMouseLeave };
}

/**
 * Custom hook for tracking element visibility (intersection observer)
 */
export function useElementVisibility(
  options: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px',
  },
) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [elementRef, isVisible] as const;
}

/**
 * Custom hook for handling long press events
 */
export function useLongPress(callback: () => void, { delay = 300 }: { delay?: number } = {}) {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  const clear = useCallback(() => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    isPressed,
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
}

/**
 * Custom hook for handling drag events
 */
export function useDrag<T extends HTMLElement = HTMLElement>() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<T | null>(null);

  const getPointerPosition = (e: MouseEvent | TouchEvent) => {
    if (e instanceof TouchEvent) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return { clientX: touch.clientX, clientY: touch.clientY };
    }

    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleDragStart = useCallback((e: MouseEvent | TouchEvent) => {
    setIsDragging(true);

    const { clientX, clientY } = getPointerPosition(e);

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }

    e.preventDefault();
  }, []);

  const handleDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !ref.current) return;

      const { clientX, clientY } = getPointerPosition(e);

      setPosition({
        x: clientX - offset.x,
        y: clientY - offset.y,
      });

      e.preventDefault();
    },
    [isDragging, offset],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mousedown', handleDragStart);
    element.addEventListener('touchstart', handleDragStart);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      element.removeEventListener('mousedown', handleDragStart);
      element.removeEventListener('touchstart', handleDragStart);
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDragStart, handleDrag, handleDragEnd]);

  return {
    ref,
    isDragging,
    position,
  };
}

/**
 * Custom hook for handling keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  {
    ctrl = false,
    shift = false,
    alt = false,
    preventDefault = true,
  }: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    preventDefault?: boolean;
  } = {},
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrlMatch = ctrl ? e.ctrlKey : !e.ctrlKey;
      const isShiftMatch = shift ? e.shiftKey : !e.shiftKey;
      const isAltMatch = alt ? e.altKey : !e.altKey;
      const isKeyMatch = e.key.toLowerCase() === key.toLowerCase();

      if (isCtrlMatch && isShiftMatch && isAltMatch && isKeyMatch) {
        if (preventDefault) {
          e.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [key, callback, ctrl, shift, alt, preventDefault]);
}
