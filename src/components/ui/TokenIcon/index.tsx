import React from 'react';
import {Box, BoxProps} from 'rebass';

interface TokenIconProps extends BoxProps {
  image: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({image, ...rest}) => (
  <Box variant="icon.token" sx={{backgroundImage: `url(${image})`}} {...rest} />
);

export default TokenIcon;
