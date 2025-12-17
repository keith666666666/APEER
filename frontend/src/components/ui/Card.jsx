import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// UI PRIMITIVES - CARD
// ============================================================================
export const Card = ({ children, className = "", hover = true, spotlight = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!spotlight) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      className={`card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={hover ? { scale: 1.02, borderColor: "rgba(255,255,255,0.2)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {spotlight && isHovered && (
        <div
          className="card-spotlight-overlay"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 191, 165, 0.15), transparent 40%)`
          }}
        />
      )}
      {children}
    </motion.div>
  );
};

