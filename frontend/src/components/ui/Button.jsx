import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// UI PRIMITIVES - BUTTON
// ============================================================================
export const Button = ({ children, variant = "primary", className = "", onClick, ...props }) => {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-danger"
  };

  return (
    <motion.button
      className={`btn ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

