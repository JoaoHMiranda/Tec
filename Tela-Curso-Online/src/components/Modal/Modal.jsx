import React, { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow-lg p-4"
        style={{ maxWidth: '500px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h5 className="modal-title mb-0">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Fechar"
              onClick={onClose}
            />
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && (
          <div className="modal-footer mt-3 d-flex justify-content-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
