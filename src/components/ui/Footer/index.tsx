import React from 'react';
import {Box, Flex, Image, Text, Link} from 'rebass';
import Container from '../Container';

const Footer: React.FC = props => {
  return (
    <>
      <Box as="footer" variant="footer.wrapper" {...props}>
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            <Image src="https://placehold.it/380x176/0A6054/0A6054" variant="footer.logo" />
            <Flex>
              {[1, 2].map((el, i) => (
                <Link href="#!" sx={{ml: 3}}>
                  <Box key={i} sx={{height: 32, width: 32, bg: 'muted'}} />
                </Link>
              ))}
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Subfooter */}
      <Box bg="muted" py="3">
        <Container>
          <Text fontSize="1">
            Data provided by{' '}
            <Link href="https://nomics.com/" target="_blank">
              Nomics
            </Link>
          </Text>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
