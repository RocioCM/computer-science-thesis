import React, { SVGProps } from 'react';

interface ChevronIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  type: 'up' | 'down' | 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

const ChevronIcon: React.FC<ChevronIconProps> = ({
  color = 'var(--colors-neutrals-n10)',
  type,
  size = 'medium',
  className = '',
  onClick,
}) => {
  const sizeClass = {
    small: 'w-2.5 h-2.5',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  const rotationClass = {
    up: 'rotate-180',
    down: 'rotate-0',
    left: 'rotate-90',
    right: '-rotate-90',
  };

  return (
    <i
      className={`inline-block ${sizeClass[size]} ${rotationClass[type]} ${className}`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 15 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block transition-transform duration-300 ease-out"
      >
        <path
          d="M14.7 1.89992L13.5 0.919922L7.50001 6.09992L1.50001 0.919921L0.300013 1.89992L7.50001 8.19992L14.7 1.89992Z"
          fill={color}
        />
      </svg>
    </i>
  );
};

export default ChevronIcon;
