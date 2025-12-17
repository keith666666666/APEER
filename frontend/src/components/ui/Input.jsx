import React from 'react';

// ============================================================================
// UI PRIMITIVES - INPUT & TEXTAREA
// ============================================================================
export const Input = ({ label, className = "", ...props }) => (
  <div className="input-wrapper">
    {label && <label className="input-label">{label}</label>}
    <input
      className={`input-field ${className}`}
      {...props}
    />
  </div>
);

export const Textarea = ({ label, className = "", ...props }) => (
  <div className="input-wrapper">
    {label && <label className="input-label">{label}</label>}
    <textarea
      className={`textarea-field ${className}`}
      {...props}
    />
  </div>
);

