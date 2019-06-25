import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import AmountTextfield from '../amount-textfield';
import Button from '../common/Button';
import FormRow, { FormRowsContainer } from '../common/FormRow';
import Loading from '../common/Loading';
import ModalTitle from '../modal-title';

import { modalStyle, themeColors } from '../../util/constants';

interface Props extends React.ComponentProps<typeof Modal> {
  token: string;
}

interface State {
  isLoading: boolean;
}

const ButtonStyled = styled(Button)`
  text-transform: uppercase;
  width: 100%;
`;

const ModalSubtitle = styled.h3`
  color: #000;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.38;
  margin: 0 0 25px;
`;

const LoadingStyled = styled(Loading)`
  margin: 0 0 18px;
  width: 100%;
`;

class WithdrawModal extends React.Component<Props, State> {
  public state = {
    isLoading: false,
  };

  public render = () => {
    const { onRequestClose, token, ...restProps } = this.props;

    return (
      <Modal {...restProps} style={modalStyle}>
        <ModalTitle title={`Withdraw ${token}`} onRequestClose={onRequestClose} />
        <FormRowsContainer>
          <FormRow text="Account" value="0x1234...5678" />
          <FormRow text={`Wallet ${token} Balance`} value="9999.9999" />
          <FormRow text={`Deposited ${token}`} value="9999.9999" />
          <FormRow text="Interest" value="Earn 0.1005% APR" valueColor={themeColors.primaryColorLighter} />
        </FormRowsContainer>
        <ModalSubtitle>Amount</ModalSubtitle>
        <AmountTextfield disabled={this.state.isLoading} token={token} />
        {this.state.isLoading ? (
          <LoadingStyled />
        ) : null}
        <ButtonStyled disabled={this.state.isLoading} onClick={this.send}>
          Withdraw
        </ButtonStyled>
      </Modal>
    );
  };

  private send = () => {
    this.setState({ isLoading: true });

    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 5000);
  };
}

export default WithdrawModal;
