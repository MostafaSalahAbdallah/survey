import React from 'react';

interface DentalIconProps {
  className?: string;
}

export const DentalIcon: React.FC<DentalIconProps> = ({
  className = 'w-5 h-5',
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Crown contour with occlusal groove and anatomical dual roots */}
      <path d="M7 2.5C4.5 2.5 3 4.5 3 8c0 3.2 1.3 6.5 2 10 .5 2.3 1.5 3.5 2.8 3.5 1.5 0 2.2-2.2 2.7-4.5.3-1.4.9-2.5 1.5-2.5s1.2 1.1 1.5 2.5c.5 2.3 1.2 4.5 2.7 4.5 1.3 0 2.3-1.2 2.8-3.5.7-3.5 2-6.8 2-10 0-3.5-1.5-5.5-4-5.5-2 0-3.5 1.5-5 1.5s-3-1.5-5-1.5z" />
      {/* Occlusal surface fissure line */}
      <path d="M9.5 7.5c.8.7 1.6.9 2.5.9s1.7-.2 2.5-.9" />
    </svg>
  );
};
