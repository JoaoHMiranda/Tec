import React from 'react';

export default function Button({
  children,
  onClick,
  variant = 'primary', 
  disabled = false,
  className = '',
  type = 'button',
}) {
  const base = 'btn';
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    'outline-primary': 'btn-outline-primary',
  };
  const variantClass = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClass} ${disabled ? 'disabled' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
