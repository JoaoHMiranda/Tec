// src/components/common/AppTextAreaField.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

function AppTextAreaField({
  label, name, value, onChange, placeholder, error, rows = 3, required = false, controlId, disabled = false, ...outrosProps
}) {
  return (
    <Form.Group className="mb-3" controlId={controlId || name}>
      <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>
      <Form.Control
        as="textarea" name={name} value={value} onChange={onChange} placeholder={placeholder}
        rows={rows} isInvalid={!!error} required={required} disabled={disabled}
        {...outrosProps}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
export default AppTextAreaField;