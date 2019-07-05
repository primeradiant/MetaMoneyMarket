import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { useWeb3Context } from 'web3-react';

import AmountTextfield from '../amount-textfield';
import Button from '../common/Button';
import FormRow, {FormRowsContainer} from '../common/FormRow';
import Loading from '../common/Loading';
import ModalTitle from '../modal-title';

import { ContractsContext } from '../../context/contracts';
import {modalStyle, themeColors} from '../../util/constants';
import {shortenAccount} from '../../util/utils';

interface Props {
  market: null | {
    address: string;
    savingsBalance: string;
    walletBalance: string;
    symbol: string;
  };
  isOpen: boolean;
  onRequestClose: () => void;
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

const WithdrawModal: React.FC<Props> = props => {
  const {onRequestClose, market, ...restProps} = props;

  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const context = useWeb3Context();
  const { contracts, fetchMetaMoneyMarketData } = useContext(ContractsContext);

  if (!market || !contracts) {
    return <div/>;
  }

  const { IERC20, metaMoneyMarket } = contracts;

  const sendWithdraw = async () => {
    if (context.active && metaMoneyMarket) {
      setIsLoading(true);
      const tokenShareAddress = await metaMoneyMarket.getTokenShare(market.address);
      const tokenShare = await IERC20.at(tokenShareAddress);
      await tokenShare.approve(metaMoneyMarket.address, '-1', { from: context.account, gas: '1000000' });
      await metaMoneyMarket.withdraw(market.address, String(amount), { from: context.account, gas: '1000000' });
      fetchMetaMoneyMarketData(contracts);
      setIsLoading(false);
      if (onRequestClose) {
        onRequestClose();
      }
    }
  };

  return (
    <Modal {...restProps} style={modalStyle}>
      <ModalTitle title={`Withdraw ${market.symbol}`} onRequestClose={onRequestClose} />
      <FormRowsContainer>
        <FormRow text="Account" value={shortenAccount(context.account || '')} />
        <FormRow text={`Wallet ${market.symbol} Balance`} value={market.walletBalance} />
        <FormRow text={`Deposited ${market.symbol}`} value={market.savingsBalance} />
        <FormRow text="Interest" value="Earn 0.1005% APR" valueColor={themeColors.primaryColorLighter} />
      </FormRowsContainer>
      <ModalSubtitle>Amount</ModalSubtitle>
      <AmountTextfield
        disabled={isLoading}
        token={market.symbol || ''}
        value={amount}
        onChange={e => setAmount(+e.currentTarget.value)}
      />
      {isLoading ? <LoadingStyled /> : null}
      <ButtonStyled disabled={isLoading} onClick={sendWithdraw}>
        Withdraw
      </ButtonStyled>
    </Modal>
  );
};

export default WithdrawModal;
