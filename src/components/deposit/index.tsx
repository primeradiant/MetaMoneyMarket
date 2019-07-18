import React, {useContext, useState} from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import {useWeb3Context} from 'web3-react';

import AmountTextfield from '../amount-textfield';
import Button from '../common/Button';
import FormRow, {FormRowsContainer} from '../common/FormRow';
import Loading from '../common/Loading';
import ModalTitle from '../modal-title';

import {ContractsContext, Market} from '../../context/contracts';
import {modalStyle, themeColors} from '../../util/constants';
import {shortenAccount} from '../../util/utils';

interface Props {
  market: null | Market;
  isOpen: boolean;
  onRequestClose: () => void;
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

const DepositModal: React.FC<Props> = props => {
  const {onRequestClose, market, ...restProps} = props;

  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const context = useWeb3Context();
  const {contracts, fetchMetaMoneyMarketData} = useContext(ContractsContext);

  if (!market || !contracts) {
    return <div />;
  }

  const {IERC20, metaMoneyMarket} = contracts;

  const sendDeposit = async () => {
    if (context.account && metaMoneyMarket) {
      setIsLoading(true);
      const token = await IERC20.at(market.address);
      await token.approve(metaMoneyMarket.address, '-1', {from: context.account, gas: '1000000'});
      await metaMoneyMarket.deposit(market.address, String(amount), {from: context.account, gas: '1000000'});
      fetchMetaMoneyMarketData(contracts, context.account);
      setIsLoading(false);
      if (onRequestClose) {
        onRequestClose();
      }
    }
  };

  return (
    <Modal {...restProps} style={modalStyle}>
      <ModalTitle title={`Deposit ${market.symbol}`} onRequestClose={onRequestClose} />
      <ModalText>
        Deposit <strong>{market.symbol}</strong> and earn interest automatically.
      </ModalText>
      <FormRowsContainer>
        <FormRow text="Account" value={shortenAccount(context.account || '')} />
        <FormRow text={`Available ${market.symbol}`} value={market.walletBalance!} />
        <FormRow text={`Deposited ${market.symbol}`} value={market.savingsBalance!} />
        <FormRow
          text="Interest"
          value={`Earn ${market.interestRate.toFixed(4)}% APR`}
          valueColor={themeColors.primaryColorLighter}
        />
      </FormRowsContainer>
      <ModalSubtitle>Amount</ModalSubtitle>
      <AmountTextfield
        disabled={isLoading}
        token={market.symbol || ''}
        value={amount}
        onChange={e => setAmount(+e.currentTarget.value)}
      />
      {isLoading ? (
        <LoadingStyled />
      ) : (
        <ModalNote>
          <ModalNoteStrong>Note:</ModalNoteStrong> we will first enable <strong>{market.symbol}</strong>, and then make
          the deposit.
        </ModalNote>
      )}
      <ButtonStyled disabled={isLoading} onClick={sendDeposit}>
        Deposit
      </ButtonStyled>
    </Modal>
  );
};

export default DepositModal;
