import React, {useState} from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import {useWeb3Context} from 'web3-react';
import {useHistory} from 'react-router-dom';
import {modalStyle} from '../../util/constants';
import Button from '../common/Button';
import Metamask from '../common/img/Metamask';
import WalletConnect from '../common/img/WalletConnect';
import RadioInput from '../common/RadioInput';
import ModalTitle from '../modal-title';

type LoginMethod = 'METAMASK' | 'WALLETCONNECT';

const LoginItems = styled.div`
  margin-bottom: 45px;
`;

const LoginItem = styled.div<{disabled?: boolean}>`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  &[disabled] {
    &::after {
      background-color: #fff;
      content: '';
      cursor: not-allowed;
      height: 100%;
      left: 0;
      opacity: 0.5;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 12;
    }
  }
`;

LoginItem.defaultProps = {
  disabled: false,
};

const LoginItemIcon = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  width: 50px;
`;

const LoginItemText = styled.div`
  flex-grow: 1;
  margin-right: 10px;
`;

const LoginItemTitle = styled.h3`
  color: #444;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
`;

const LoginItemDescription = styled.p`
  color: #444;
  font-size: 13px;
  font-style: normal;
  line-height: 1.23;
  margin: 0;
`;

const RadioInputWrapper = styled.div`
  flex-shrink: 0;
`;

const ButtonStyled = styled(Button)`
  text-transform: uppercase;
  width: 100%;
`;

export const LoginModal: React.FC<React.ComponentProps<typeof Modal>> = props => {
  const {onRequestClose, ...restProps} = props;
  const context = useWeb3Context();
  const history = useHistory();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('METAMASK');

  const login: React.MouseEventHandler<HTMLButtonElement> = e => {
    if (loginMethod === 'METAMASK') {
      context.setConnector('MetaMask');
    }

    if (loginMethod === 'WALLETCONNECT') {
      context.setConnector('WalletConnect');
    }

    if (onRequestClose) {
      onRequestClose(e);
      history.push('/my-account');
    }
  };

  return (
    <Modal {...restProps} style={modalStyle}>
      <ModalTitle title="Login" onRequestClose={onRequestClose} />
      <LoginItems>
        <LoginItem onClick={() => setLoginMethod('WALLETCONNECT')}>
          <LoginItemIcon>
            <WalletConnect />
          </LoginItemIcon>
          <LoginItemText>
            <LoginItemTitle>WalletConnect</LoginItemTitle>
            <LoginItemDescription>Connect using your mobile wallet.</LoginItemDescription>
          </LoginItemText>
          <RadioInputWrapper>
            <RadioInput checked={loginMethod === 'WALLETCONNECT'} />
          </RadioInputWrapper>
        </LoginItem>

        <LoginItem onClick={() => setLoginMethod('METAMASK')}>
          <LoginItemIcon>
            <Metamask />
          </LoginItemIcon>
          <LoginItemText>
            <LoginItemTitle>MetaMask</LoginItemTitle>
            <LoginItemDescription>Use this popular browser extension wallet.</LoginItemDescription>
          </LoginItemText>
          <RadioInputWrapper>
            <RadioInput checked={loginMethod === 'METAMASK'} />
          </RadioInputWrapper>
        </LoginItem>
      </LoginItems>

      <ButtonStyled onClick={login}>Login</ButtonStyled>
    </Modal>
  );
};
