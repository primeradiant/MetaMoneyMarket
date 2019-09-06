import React from 'react';
import {Box, Flex, Image, Text, Link} from 'rebass';
import Container from '../Container';
import {GitHub, Twitter, Telegram, Medium} from '../Icons/';

import lockup from '../../../assets/images/mmm-lockup.svg';

const Lockup: React.FC = props => <Image src={lockup} variant="footer.logo" {...props} />;

const socialMediaAccounts = [
  {
    name: 'Twitter',
    link: 'https://twitter.com/metamoneymarket',
    icon: <Twitter />,
  },
  {
    name: 'GitHub',
    link: 'https://github.com/primeradiant/MetaMoneyMarket',
    icon: <GitHub />,
  },
  {
    name: 'Medium',
    link: 'https://medium.com/primeradiant',
    icon: <Medium />,
  },
  {
    name: 'Telegram',
    link: 'https://t.me/joinchat/BhTqaRU6',
    icon: <Telegram />,
  },
];

const Footer: React.FC = props => {
  return (
    <>
      <Box as="footer" variant="footer.wrapper" {...props}>
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            <Lockup />
            <Flex>
              {socialMediaAccounts.map((el, i) => (
                <Link key={i} target="_blank" href={el.link} sx={{ml: 3}}>
                  <Box variant="footer.icon">{el.icon}</Box>
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
