import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {Box, Button, Flex, Image} from 'rebass';
import {useWeb3Context} from 'web3-react';
import {LoginModal} from '../../login';
import Container from '../Container';

import brandmark from '../../../assets/images/mmm-brandmark.svg';

const Brandmark: React.FC = props => <Image src={brandmark} variant="nav.logo" {...props} />;

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  redirect: (path: string) => void;
}

const Navigation: React.FC<NavigationProps> = props => {
  const context = useWeb3Context();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const logout = () => {
    context.unsetConnector();
  };

  return (
    <>
      <Box variant="nav.wrapper" {...props}>
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            <NavLink to="/">
              <Brandmark />
            </NavLink>
            <Flex alignItems="center">
              {!context.account && (
                <Button onClick={openModal} variant="text">
                  Login
                </Button>
              )}
              {context.account && (
                <Button onClick={logout} variant="text">
                  Logout
                </Button>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
      <LoginModal isOpen={modalIsOpen} onRequestClose={closeModal} redirect={props.redirect} />
    </>
  );
};

export default Navigation;
