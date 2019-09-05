import React from 'react';
import {Box, Flex, Image, Button} from 'rebass';
import Container from '../Container';

import brandmark from '../../../assets/images/mmm-brandmark.svg';

const Brandmark: React.FC = props => <Image src={brandmark} variant="nav.logo" {...props} />;

const Navigation: React.FC = props => {
  return (
    <Box variant="nav.wrapper" {...props}>
      <Container>
        <Flex justifyContent="space-between" alignItems="center">
          <Brandmark />
          <Button variant="text">Login</Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navigation;
