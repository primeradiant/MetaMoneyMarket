import React from 'react';
import {Box, BoxProps} from 'rebass';

const ThreeColumnGrid: React.FC<BoxProps> = props => (
  <Box
    sx={{
      display: ['block', 'grid'],
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridColumnGap: 4,
    }}
    {...props}
  />
);

export {ThreeColumnGrid};
