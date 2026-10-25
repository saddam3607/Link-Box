import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

interface RgbBoxProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  rounded?: string;
  onClick?: () => void;
  hoverScale?: boolean;
  borderWidth?: number;
  highlight?: boolean;
}

export const RgbBox: React.FC<RgbBoxProps> = ({
  children,
  className = '',
  innerClassName = '',
  rounded = 'rounded-2xl',
  onClick,
  hoverScale = false,
  borderWidth = 2,
  highlight = false,
}) => {
  const { currentRgbGradient, currentRgbSpeed, currentRgbBlur, currentRgbOpacity } = useThemeContext();

  const outerRadius = rounded;

  return (
    <div
      onClick={onClick}
      style={{
        padding: `${borderWidth}px`,
        // Pass CSS variables to control the rotating RGB border
        ['--rgb-gradient' as string]: currentRgbGradient,
        ['--rgb-speed' as string]: currentRgbSpeed,
        ['--rgb-blur' as string]: highlight ? '10px' : currentRgbBlur,
        ['--rgb-opacity' as string]: highlight ? '1.0' : currentRgbOpacity,
      }}
      className={`rgb-card-wrapper ${outerRadius} ${
        hoverScale ? 'transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99]' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className={`rgb-card-inner ${innerClassName}`}
        style={{
          borderRadius: `calc(${outerRadius === 'rounded-3xl' ? '1.5rem' : outerRadius === 'rounded-2xl' ? '1rem' : outerRadius === 'rounded-xl' ? '0.75rem' : '0.5rem'} - ${borderWidth}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};
