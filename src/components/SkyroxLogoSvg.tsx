import React from 'react';

interface SkyroxEmblemProps {
  className?: string;
  strokeOnly?: boolean;
}

/**
 * Vector reconstruction faithful to the official SKYROX emblem:
 * - Interlocked yellow geometric 'S' (#F5D400) on the lower-left
 * - Sharp white geometric 'R' (#FFFFFF) sweeping right
 * - Yellow circular dot (#F5D400) poised top-right
 */
export const SkyroxEmblemSvg: React.FC<SkyroxEmblemProps> = ({
  className = 'w-9 h-9',
  strokeOnly = false,
}) => {
  return (
    <svg
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SKYROX emblem"
      role="img"
    >
      {/* Yellow Geometric S Component */}
      <path
        className="skyrox-s-path"
        d="M16 20 L28 20 L28 50 L49 50 L73 90 L14 90 L22 76 L46 76 L35 61 L16 61 Z"
        fill={strokeOnly ? 'transparent' : '#F5D400'}
        stroke="#F5D400"
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />
      {/* White Geometric R Component */}
      <path
        className="skyrox-r-path"
        d="M35 20 L66 20 C83 20 89 30 89 41 C89 51 82 59 69 61 L96 90 L79 90 L53 60 L53 50 L65 50 C72 50 76 46 76 41 C76 35 72 32 64 32 L35 32 Z"
        fill={strokeOnly ? 'transparent' : '#FFFFFF'}
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />
      {/* Yellow Accent Dot */}
      <circle
        className="skyrox-dot"
        cx="95"
        cy="17"
        r="9"
        fill={strokeOnly ? 'transparent' : '#F5D400'}
        stroke="#F5D400"
        strokeWidth="2"
      />
    </svg>
  );
};
