// src/components/common/AppInputField.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

function AppInputField({
  label, type, name, value, onChange, placeholder, error, required = false, controlId, disabled = false, min, step, ...outrosProps
}) {
  return (
    <Form.Group className="mb-3" controlId={controlId || name}>
      <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>
      <Form.Control
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        isInvalid={!!error} required={required} disabled={disabled} min={min} step={step}
        {...outrosProps}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
export default AppInputField;