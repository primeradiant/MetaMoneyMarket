import React, {useState} from 'react';
import {useHistory} from 'react-router';
import {Link} from 'react-router-dom';
import {Box, Button, Flex, Image, ImageProps} from 'rebass';
import {useWeb3Context} from 'web3-react';
import brandmark from '../../../assets/images/mmm-brandmark.svg';
import LoginModal from '../../login';
import Container from '../Container';
import {shortenAccount} from '../../../util/utils';

const Brandmark: React.FC<ImageProps> = props => <Image src={brandmark} variant="nav.logo" {...props} />;

const Navigation: React.FC = () => {
  const context = useWeb3Context();
  const history = useHistory();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const logout = () => {
    context.unsetConnector();
    history.push('/');
  };

  const goToDashboard = () => history.push('/my-account');

  return (
    <>
      <Box variant="nav.wrapper">
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            <Link to="/">
              <Brandmark />
            </Link>
            <Flex alignItems="center">
              {!context.account && (
                <Button onClick={openModal} variant="text">
                  Login
                </Button>
              )}
              {context.account && (
                <>
                  <Button onClick={logout} variant="text">
                    Logout
                  </Button>
                  <Box height={40} width={2} bg="muted" />
                  <Button onClick={goToDashboard} variant="text">
                    {shortenAccount(context.account)}
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
      <LoginModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </>
  );
};

export default Navigation;
