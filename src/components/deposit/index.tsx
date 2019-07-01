import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import AmountTextfield from '../amount-textfield';
import Button from '../common/Button';
import FormRow, {FormRowsContainer} from '../common/FormRow';
import Loading from '../common/Loading';
import ModalTitle from '../modal-title';

import {modalStyle, themeColors} from '../../util/constants';

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

const ModalText = styled.p`
  color: #444;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.3;
  margin: 0 0 18px;
`;

const ModalNote = styled.p`
  color: #999;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.42;
  margin: 0 0 15px;
`;

const ModalNoteStrong = styled.span`
  color: #666;
  font-weight: 700;
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

class DepositModal extends React.Component<Props, State> {
  public state = {
    isLoading: false,
  };

  public render = () => {
    const {onRequestClose, token, ...restProps} = this.props;

    return (
      <Modal {...restProps} style={modalStyle}>
        <ModalTitle title={`Deposit ${token}`} onRequestClose={onRequestClose} />
        <ModalText>
          Deposit <strong>{token}</strong> and earn interest automatically.
        </ModalText>
        <FormRowsContainer>
          <FormRow text="Account" value="0x1234...5678" />
          <FormRow text={`Available ${token}`} value="9999.9999" />
          <FormRow text={`Deposited ${token}`} value="9999.9999" />
          <FormRow text="Interest" value="Earn 0.1005% APR" valueColor={themeColors.primaryColorLighter} />
        </FormRowsContainer>
        <ModalSubtitle>Amount</ModalSubtitle>
        <AmountTextfield disabled={this.state.isLoading} token={token} />
        {this.state.isLoading ? (
          <LoadingStyled />
        ) : (
          <ModalNote>
            <ModalNoteStrong>Note:</ModalNoteStrong> we will first enable <strong>{token}</strong>, and then make the
            deposit.
          </ModalNote>
        )}
        <ButtonStyled disabled={this.state.isLoading} onClick={this.sendDeposit}>
          Deposit
        </ButtonStyled>
      </Modal>
    );
  };

  private sendDeposit = () => {
    this.setState({isLoading: true});

    setTimeout(() => {
      this.setState({isLoading: false});
    }, 5000);
  };
}

export default DepositModal;
