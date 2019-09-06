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
import {ThreeColumnGrid} from '../ui/Grid';
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

          <Text as="p" mb={4} variant="subheading">
            Simplify your approach to savings and reliably increase your returns with Meta Money Market.
          </Text>

          <Button>Join early access</Button>
          {/* <MailChimpForm /> */}
        </Container>
      </Section>

      <Section bg="primary">
        <Container>
          <Image src="https://placehold.it/160x160" variant="icon" />

          <Heading as="h2" variant="h2" mt={4} mb={3} color="text.light">
            Make the most of your crypto
          </Heading>
          <Text as="p" color="text.light" variant="paragraph">
            At Meta Money Market, we’re aiming to revolutionize banking, to ensure that you always get the most from
            your money. We allow you to get the strongest rates when moving your money on chain - without any hassle and
            without risk.
          </Text>
        </Container>
      </Section>

      <Section>
        <Container>
          <ThreeColumnGrid>
            <Card mb={[4, 0]}>
              <Image src="https://placehold.it/128x128/0A6054/0A6054" sx={{height: 64, width: 64}} />
              <Text fontWeight="bold" fontSize={3} mt={4} mb={3}>Best Rate</Text>
              <Text as="p">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat alias non eos labore cumque vel
                quibusdam? Placeat recusandae provident nihil assumenda. Voluptatem debitis molestias, ut asperiores
                natus ipsa tenetur enim?
              </Text>
            </Card>
            <Card mb={[4, 0]}>
              <Image src="https://placehold.it/128x128/0A6054/0A6054" sx={{height: 64, width: 64}} />
              <Text fontWeight="bold" fontSize={3} mt={4} mb={3}>Meta Tokens</Text>
              <Text as="p">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum deleniti repellat necessitatibus saepe
                vero accusamus cum mollitia dolorem aperiam temporibus odit nihil explicabo ipsam non neque ipsa,
                incidunt similique omnis.
              </Text>
            </Card>
            <Card mb={[4, 0]}>
              <Image src="https://placehold.it/128x128/0A6054/0A6054" sx={{height: 64, width: 64}} />
              <Text fontWeight="bold" fontSize={3} mt={4} mb={3}>Auto Rebalance</Text>
              <Text as="p">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit illum porro voluptas, laudantium, quia,
                commodi nulla rem soluta aliquam iure quod. Nostrum, fugiat aspernatur quis vero officia blanditiis
                sint! Ex?
              </Text>
            </Card>
          </ThreeColumnGrid>
        </Container>
      </Section>

      <Section bg="primary">
        <Container>
          <Image src="https://placehold.it/160x160" variant="icon" />

          <Heading as="h2" variant="h2" mt={4} mb={3} color="text.light">
            How it works?
          </Heading>
          <Text as="p" color="text.light" variant="paragraph">
            Instead of manually moving money around burning fees chasing the optimal interest rate. Deposit your tokens
            into the MetaMoneyMarket, and the smart contract will automatically deposit into the highest yielding Money
            Market, periodically rebalancing for you when rates change.
          </Text>

          <Box mt={4}>
            <AccountBalance marketsData={marketsData} isLoggedIn={false} redirect={path => props.history.push(path)} />
          </Box>
        </Container>
      </Section>

      <LoginModal isOpen={modalIsOpen} onRequestClose={closeModal} redirect={path => props.history.push(path)} />
    </Wrapper>
  );
};

export default Landing;
