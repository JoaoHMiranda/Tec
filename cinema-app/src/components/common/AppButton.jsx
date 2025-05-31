// src/components/common/AppButton.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

function AppButton({
  children, onClick, type = 'button', variant = 'primary', className, disabled = false, ...outrosProps
}) {
  return (
    <Button onClick={onClick} type={type} variant={variant} className={className} disabled={disabled} {...outrosProps}>
      {children}
    </Button>
  );
}
export default AppButton;