import { useState, useEffect, useRef, useCallback } from 'react';
import { focusTrap, SrOnly } from './accessibility-utils';

interface AccessibleModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Whether to show close button */
  closeButton?: boolean;
  /** Whether to prevent body scroll */
  preventScroll?: boolean;
  /** Modal className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeButton = true,
  preventScroll = true,
  className = '',
  children
}: AccessibleModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const focusTrapCallback = useRef<(() => void) | null>(null);

  // Size configurations
  const sizeConfig: Record<string, { maxWidth: string }> = {
    sm: { maxWidth: 'max-w-sm' },
    md: { maxWidth: 'max-w-md' },
    lg: { maxWidth: 'max-w-lg' },
    full: { maxWidth: 'max-w-full' }
  };

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Open modal
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);

      // Prevent body scroll
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }

      // Set up focus trap
      if (modalRef.current) {
        focusTrapCallback.current = focusTrap(modalRef.current);

        // Focus on modal when it opens
        modalRef.current.focus();
      }

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // Clean up when closing
      if (preventScroll) {
        document.body.style.overflow = '';
      }

      document.removeEventListener('keydown', handleKeyDown);

      // Unmount after transition ends
      setTimeout(() => {
        setIsMounted(false);
      }, 300); // Match CSS transition duration
    }
  }, [isOpen, onClose, preventScroll, handleKeyDown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preventScroll) {
        document.body.style.overflow = '';
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [preventScroll]);

  if (!isOpen && !isMounted) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm
          ${isOpen && !isMounted ? 'opacity-0' : ''}
          ${!isOpen && isMounted ? 'opacity-100' : ''}
          transition-opacity duration-300`}
        onClick={handleBackdropClick}
      >
        {/* Modal container */}
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`relative w-full max-w-xl p-4 ${sizeConfig[size].maxWidth}
            bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg
            transform scale-95 opacity-0
            ${isOpen && isMounted ? 'scale-100 opacity-100' : ''}
            transition-transform duration-300 transition-opacity duration-300`}
        >
          {/* Close button */}
          {closeButton && (
            <button
              type="button"
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-200"
              onClick={onClose}
              aria-label="Close modal"
            >
              <SrOnly>Close modal</SrOnly>
              <X className="h-3 w-3" />
            </button>
          )}

          {/* Modal content */}
          <div className="space-y-4">
            {/* Header */}
            {title && (
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-indigo-900/30 rounded-full">
                  <span className="text-indigo-400 font-medium text-sm">
                    {title.match(/^[A-Z]/) ? title.charAt(0) : '📄'}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="text-lg font-medium text-slate-100">{title}</h2>
                  {SrOnly}
                  <span className="text-xs text-slate-400">
                    Press Escape to close
                  </span>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="divide-y divide-slate-800">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Simple alert dialog
 */
export function AccessibleAlertDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  showCancel = false,
  className = '',
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  className?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={className}
    >
      <div className="space-y-4">
        <p className="text-slate-400">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          {showCancel && (
            <button
              type="button"
              onClick={onCancel || onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 bg-slate-900/50 hover:bg-slate-800/50 rounded-lg"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm || onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </AccessibleModal>
  );
}

/**
 * Confirmation dialog
 */
export function AccessibleConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  className = '',
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AccessibleAlertDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      showCancel={true}
      className={className}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export {
  AccessibleModal,
  AccessibleAlertDialog,
  AccessibleConfirmDialog
};