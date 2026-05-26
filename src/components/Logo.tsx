import React from "react";

export default function Logo({
  className = "",
  width = 120,
  color = "url(#logo-grad)",
}: {
  className?: string;
  width?: number;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      width={width}
      height={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f53775" />
          <stop offset="100%" stopColor="#fa8b41" />
        </linearGradient>
      </defs>
      <g fill="none">
        {/* Layer 1 (Top rounded block) */}
        <path
          d="M120 40 L65 65 L120 90 L175 65 Z"
          fill={color}
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Layer 2 (Middle) */}
        <path
          d="M65 90 L120 115 L175 90"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Layer 3 (Bottom) */}
        <path
          d="M65 115 L120 140 L175 115"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Text STACKMALL */}
        <text
          x="120"
          y="205"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="26"
          fill={color}
          letterSpacing="2"
          textAnchor="middle"
        >
          STACKMALL
        </text>
      </g>
    </svg>
  );
}
