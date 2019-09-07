import React, {HTMLAttributes, useContext, useState} from 'react';
import {Box, Button, Card, Heading, Text} from 'rebass';
import {ContractsContext} from '../../context/contracts';
import {LoginModal} from '../login';
import AccountBalance from '../my-account/AccountBalance';
import Container from '../ui/Container';
import Footer from '../ui/Footer';
import {ThreeColumnGrid} from '../ui/Grid';
import {Rates, Rocket, Savings, Simplicity} from '../ui/Icons';
import Navigation from '../ui/Navigation';
import Root from '../ui/Root';
import Section from '../ui/Section';
import ThemeProvider from '../ui/ThemeProvider';
import {MailChimpForm} from './MailChimpForm';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: any;
}

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  redirect: (path: string) => void;
}

interface State {
  modalIsOpen: boolean;
}

const Wrapper: React.FC<WrapperProps> = ({children, redirect}) => (
  <ThemeProvider>
    <Root>
      <Navigation redirect={redirect} />
      {children}
      <Footer />
    </Root>
  </ThemeProvider>
);

const Landing: React.FC<Props> = (props: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => setModalIsOpen(false);

  const {marketsData} = useContext(ContractsContext);

  return (
    <Wrapper redirect={path => props.history.push(path)}>
      <Section variant="hero">
        <Container>
          <Heading as="h1" variant="h1" mb={4}>
            Your money, maximized
          </Heading>

          <Text as="p" mb={4} variant="subheading">
            Simplify your approach to savings and reliably increase your returns with MetaMoneyMarket.
          </Text>

          <Button as="a" href="#sign-up">
            Join early access
          </Button>
        </Container>
      </Section>

      <Section bg="primary">
        <Container>
          <Box as={Rocket} variant="icon.section" />

          <Heading as="h2" variant="h2" mt={4} my={3} color="text.light">
            Make the most of your crypto
          </Heading>
          <Text as="p" mb={[14, 24]} color="text.light" variant="paragraph">
            At MetaMoneyMarket, we’re aiming to revolutionize banking, to ensure that you always get the most from your
            money. We allow you to get the strongest rates when moving your money on chain - without any hassle.
          </Text>
        </Container>
      </Section>

      <Section>
        <Container>
          <ThreeColumnGrid>
            <Card mb={[4, 0]}>
              <Box as={Rates} variant="icon.card" />
              <Text fontWeight="bold" fontSize={3} my={3}>
                Always the best rates
              </Text>
              <Text as="p">
                We combine multiple markets to give you interest rates that beat the best traditional offerings across
                the top tokens and platforms.
              </Text>
            </Card>
            <Card mb={[4, 0]}>
              <Box as={Simplicity} variant="icon.card" />
              <Text fontWeight="bold" fontSize={3} my={3}>
                Assured simplicity
              </Text>
              <Text as="p">
                There’s no need to worry about finding the best option - our tool will automatically rebalance your
                funds when rates change.
              </Text>
            </Card>
            <Card>
              <Box as={Savings} variant="icon.card" />
              <Text fontWeight="bold" fontSize={3} my={3}>
                Guaranteed savings
              </Text>
              <Text as="p">
                Auto-rebalancing assures an interest increase of approximately 10%, with no hefty losses due to
                traditional balancing fees.
              </Text>
            </Card>
          </ThreeColumnGrid>
        </Container>
      </Section>

      <Section bg="primary">
        <Container>
          <ThreeColumnGrid>
            <Box mb={[4, 0]}>
              <Text as="p" color="text.light" variant="paragraph">
                Simply deposit DAI into MetaMoneyMarket and receive a corresponding token share in our pool. The tool
                will automatically move DAI across decentralized finance protocols to ensure you the best interest rate
                and grow the value of your token share.
              </Text>
            </Box>

            <Box sx={{gridColumnEnd: 'span 2'}}>
              <Box sx={{maxWidth: 864}}>
                <AccountBalance
                  marketsData={marketsData}
                  isLoggedIn={false}
                  redirect={path => props.history.push(path)}
                />
              </Box>
            </Box>
          </ThreeColumnGrid>
        </Container>
      </Section>

      <Box as="section" py={[4, 5]} bg="muted" id="sign-up">
        <Container>
          <Box mb={4}>
            <Heading color="primary" fontSize={[4, 5]} as="p" sx={{maxWidth: 480}}>
              Be the first to know about our new features and progress.
            </Heading>
          </Box>
          <Box sx={{maxWidth: 480}}>
            <MailChimpForm />
          </Box>
        </Container>
      </Box>

      <LoginModal isOpen={modalIsOpen} onRequestClose={closeModal} redirect={path => props.history.push(path)} />
    </Wrapper>
  );
};

export default Landing;
