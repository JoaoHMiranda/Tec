// src/components/common/AppSelectField.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

function AppSelectField({
  label, name, value, onChange, options = [], placeholder, error, required = false, controlId, disabled = false, ...outrosProps
}) {
  return (
    <Form.Group className="mb-3" controlId={controlId || name}>
      <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>
      <Form.Select name={name} value={value} onChange={onChange} isInvalid={!!error} required={required} disabled={disabled} {...outrosProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
export default AppSelectField;