import React, {HTMLAttributes, useContext, useState} from 'react';
import {Heading, Text, Flex, Link, Card, Box, Image, Button} from 'rebass';
import {ContractsContext} from '../../context/contracts';
import {LoginModal} from '../login';
import AccountBalance from '../my-account/AccountBalance';
import ThemeProvider from '../ui/ThemeProvider';
import Container from '../ui/Container';
import {MailChimpForm} from './MailChimpForm';
import Section from '../ui/Section';
import Root from '../ui/Root/';
import Navigation from '../ui/Navigation/';
import Footer from '../ui/Footer/';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: any;
}

interface State {
  modalIsOpen: boolean;
}

const Wrapper: React.FC = ({children}) => (
  <ThemeProvider>
    <Root>
      <Navigation />
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
    <Wrapper>
      <Section variant="hero">
        <Container>
          <Heading as="h1" variant="h1" mb={4}>
            Your money, maximized
          </Heading>

          <Text as="p" fontSize="4" mb={4} sx={{maxWidth: 600}}>
            Simplify your approach to savings and reliably increase your returns with Meta Money Market.
          </Text>

          <Button>Join early access</Button>
          {/* <MailChimpForm /> */}
        </Container>
      </Section>

      <Section bg="primary">
        <Container>
          <Image src="https://placehold.it/160x160" variant="icon" />

          <Heading as="h2" variant="h2" color="text.light">
            Mission
          </Heading>
          <Text as="p" color="text.light">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum amet sed fuga laborum minus error deleniti
            ullam atque earum. Accusantium eum esse cumque laboriosam. Rem aperiam perferendis harum officia magni?
          </Text>
        </Container>
      </Section>

      <Section>
        <Container>
          <Box>
            <Image src="https://placehold.it/160x160" variant="icon" />
            <Heading as="h2" variant="h2">
              Benefits
            </Heading>
            <Text as="p">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum amet sed fuga laborum minus error deleniti
              ullam atque earum. Accusantium eum esse cumque laboriosam. Rem aperiam perferendis harum officia magni?
            </Text>
          </Box>

          <Flex>
            <Card>
              <Text fontWeight="bold">Best Rate</Text>
              <Text as="p">
                By combining multiple markets into one, you get the best rate for a wider number of tokens than any
                contract.
              </Text>
            </Card>
            <Card>
              <Text fontWeight="bold">Meta Tokens</Text>
              <Text as="p">
                You will receive a Token which represents your balance on deposit. Which you can then use in other DeFi
                Protocols.
              </Text>
            </Card>
            <Card>
              <Text fontWeight="bold">Auto Rebalance</Text>
              <Text as="p">
                If you rebalanced 1x a day for a year, you'd burn 43% of a $100 deposit. MMM is only ~0.3% (no annual
                fee).
              </Text>
            </Card>
          </Flex>
        </Container>
      </Section>

      <Section bg="primary">
        <Container>
          <Image src="https://placehold.it/160x160" variant="icon" />

          <Heading as="h2" variant="h2" color="text.light">
            How it works?
          </Heading>
          <Text as="p" color="text.light">
            Instead of manually moving money around burning fees chasing the optimal interest rate. Deposit your tokens
            into the MetaMoneyMarket, and the smart contract will automatically deposit into the highest yielding Money
            Market, periodically rebalancing for you when rates change.
          </Text>

          <AccountBalance marketsData={marketsData} isLoggedIn={false} redirect={path => props.history.push(path)} />
        </Container>
      </Section>

      <LoginModal isOpen={modalIsOpen} onRequestClose={closeModal} redirect={path => props.history.push(path)} />
    </Wrapper>
  );
};

export default Landing;
