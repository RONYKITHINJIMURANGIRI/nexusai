import React from 'react';

const Pill = ({ 
  label, 
  variant = 'default', 
  onClick, 
  closable = false, 
  onClose, 
  loading = false, 
  icon, 
  className = '', 
  style 
}) => {
  const baseClass = 'pill';
  const variantClass = variant ? `pill-${variant}` : '';
  const fullClassName = [baseClass, variantClass, className].filter(Boolean).join(' ');

  return (
    <span
      className={fullClassName}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(e);
        }
      } : undefined}
    >
      {loading && (
        <span className="pill-loading" aria-label="Loading" />
      )}
      {icon && (
        <span className="pill-icon">
          {icon}
        </span>
      )}
      {!loading && label}
      {closable && (
        <span
          className="pill-close"
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose(e);
          }}
          aria-label="Close"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              if (onClose) onClose(e);
            }
          }}
        >
          ×
        </span>
      )}
    </span>
  );
};

export default Pill;