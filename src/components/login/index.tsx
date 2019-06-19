import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import Button from '../common/Button';
import RadioInput from '../common/RadioInput';
import CloseModal from '../common/img/CloseModal';
import Metamask from '../common/img/Metamask';
import SMS from '../common/img/SMS';

import { modalStyle, themeColors } from '../../util/constants';

interface Props extends React.ComponentProps<typeof Modal> {}

interface State {
  loginMethod: string;
}

const ModalTitle = styled.div`
  align-items: flex-start;
  border-bottom: 1px solid ${themeColors.borderColor};
  display: flex;
  justify-content: space-between;
  margin: 0 0 25px;
  padding: 0 0 10px 0;
`;

const ModalTitleText = styled.h2`
  color: #222;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  padding: 0 15px 0 0;
`;

const ModalClose = styled.div`
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  height: 21px;
  justify-content: flex-end;
  width: 30px;
`;

const LoginItems = styled.div`
  margin-bottom: 45px;
`;

const LoginItem = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }
`;

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

class LoginModal extends React.Component<Props, State> {
  public state = {
    loginMethod: 'phone',
  };

  public render = () => {
    const { onRequestClose, ...restProps } = this.props;

    return (
      <Modal {...restProps} style={modalStyle}>
        <ModalTitle>
          <ModalTitleText>Login</ModalTitleText>
          <ModalClose onClick={onRequestClose}>
            <CloseModal />
          </ModalClose>
        </ModalTitle>
        <LoginItems>
          <LoginItem>
            <LoginItemIcon>
              <SMS />
            </LoginItemIcon>
            <LoginItemText>
              <LoginItemTitle>Use your phone</LoginItemTitle>
              <LoginItemDescription>
                Get a secure wallet quickly with only your phone number and a PIN.
              </LoginItemDescription>
            </LoginItemText>
            <RadioInputWrapper>
              <RadioInput checked={this.state.loginMethod === 'phone'} />
            </RadioInputWrapper>
          </LoginItem>
          <LoginItem>
            <LoginItemIcon>
              <Metamask />
            </LoginItemIcon>
            <LoginItemText>
              <LoginItemTitle>MetaMask</LoginItemTitle>
              <LoginItemDescription>Use this popular browser extension wallet.</LoginItemDescription>
            </LoginItemText>
            <RadioInputWrapper>
              <RadioInput checked={this.state.loginMethod === 'metamask'} />
            </RadioInputWrapper>
          </LoginItem>
        </LoginItems>
        <ButtonStyled>Login</ButtonStyled>
      </Modal>
    );
  };
}

export default LoginModal;
