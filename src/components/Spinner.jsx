import React from 'react';

function Spinner({ 
  size = 8, 
  color = 'inherit', 
  speed = 1, 
  gap = 6, 
  dotCount = 3, 
  ariaLabel = 'Loading' 
}) {
  const dots = Array.from({ length: dotCount }, (index) => (
    <div
      key={index}
      className="dot"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${speed}s`,
        animationDelay: `${index * 0.15 * speed}s`,
      }}
    />
  ));

  return (
    <div
      className="spinner"
      aria-label={ariaLabel}
      style={{ gap: `${gap}px`, color }}
    >
      {dots}
    </div>
  );
}

Spinner.displayName = 'Spinner';

export default Spinner;