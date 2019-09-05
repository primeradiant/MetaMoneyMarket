import React from 'react';
import {Box} from 'rebass';

const ThreeColumnGrid = props => (
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
