import React from 'react';
import {Box} from 'rebass';

interface LoadingSpinnerProps {
  loading: boolean;
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({loading, size, color}) => {
  if (!loading) return null;

  return (
    <Box height={size} width={size} color={color}>
      <svg
        x="0px"
        y="0px"
        viewBox="0 0 150 150"
        style={{
          animation: `loading 2s linear infinite`,
        }}
      >
        <circle
          cx="75"
          cy="75"
          r="60"
          style={{
            strokeDashoffset: 600,
            strokeDasharray: 300,
            strokeWidth: 12,
            strokeMiterlimit: 10,
            strokeLinecap: 'round',
            animation: `loadingCircle 1.6s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite`,
            stroke: 'currentColor',
            fill: 'transparent',
          }}
        />
      </svg>
    </Box>
  );
};

LoadingSpinner.defaultProps = {
  loading: false,
  size: 40,
  color: 'primary',
};

export default LoadingSpinner;
