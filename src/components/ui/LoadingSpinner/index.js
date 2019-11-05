import PropTypes from 'prop-types';
import React from 'react';
import {Box} from 'rebass';

const LoadingSpinner = ({loading, size, color}) => {
  if (!loading) return null;

  return (
    <Box height={size} width={size} color={color}>
      <Box
        as="svg"
        sx={{
          animation: `loading 2s linear infinite`,
        }}
        x="0px"
        y="0px"
        viewBox="0 0 150 150"
      >
        <Box
          as="circle"
          sx={{
            strokeDashoffset: 600,
            strokeDasharray: 300,
            strokeWidth: 12,
            strokeMiterlimit: 10,
            strokeLinecap: 'round',
            animation: `loadingCircle 1.6s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite`,
            stroke: 'currentColor',
            fill: 'transparent',
          }}
          cx="75"
          cy="75"
          r="60"
        />
      </Box>
    </Box>
  );
};

LoadingSpinner.defaultProps = {
  size: 40,
  color: 'primary',
};

LoadingSpinner.propTypes = {
  loading: PropTypes.bool,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default LoadingSpinner;
