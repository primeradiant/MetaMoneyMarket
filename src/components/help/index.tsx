import React from 'react';
import {Heading, Text} from 'rebass';
import Container from '../ui/Container';
import Section from '../ui/Section';
import Wrapper from '../ui/Wrapper';

const Help = () => {
  return (
    <Wrapper>
      <Section>
        <Container>
          <Heading as="h1" variant="h1" mb={4}>
            Help
          </Heading>

          <Text as="p" mb={4} variant="subheading">
            Frequently asked questions and resources for getting started earning with MetaMoneyMarket.
          </Text>
        </Container>
      </Section>
    </Wrapper>
  );
};

export default Help;
