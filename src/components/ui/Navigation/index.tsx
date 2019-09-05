import React from 'react';
import {Box, Flex, Image, Button} from 'rebass';
import Container from '../Container';

const Navigation: React.FC = props => {
  return (
    <Box variant="nav.wrapper" {...props}>
      <Container>
        <Flex justifyContent="space-between" alignItems="center">
          <Image src="https://placehold.it/80x80/0A6054/0A6054" variant="nav.logo" />
          <Button variant="text">Login</Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navigation;
