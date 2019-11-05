import BN from 'bn.js';
import React, {useContext, useState} from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import {useWeb3Context} from 'web3-react';

import AmountTextfield from '../amount-textfield';
import Button from '../common/Button';
import FormRow, {FormRowsContainer} from '../common/FormRow';
import Loading from '../common/Loading';
import ModalTitle from '../modal-title';

import {ContractsContext} from '../../context/contracts';
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

const ModalNote = styled.p`
  color: #999;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.42;
  margin: 0 0 15px;
`;

const ModalNoteError = styled.div`
  color: lightcoral;
  font-weight: 700;
`;

const WithdrawModal: React.FC<Props> = props => {
  const {onRequestClose, market, ...restProps} = props;

  const [amount, setAmount] = useState<Maybe<BN>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxEnabled, setMaxEnabled] = useState(false);
  const [error, setError] = useState<Maybe<Error>>(null);

  const onMax = () => {
    setMaxEnabled(true);
    if (market && market.depositBalance) {
      setAmount(market.depositBalance.amount);
    }
  };

  const context = useWeb3Context();
  const {contracts, fetchMetaMoneyMarketData} = useContext(ContractsContext);

  if (!market || !contracts || !market.depositBalance || !market.walletBalance) {
    return <div />;
  }

  const {IERC20, metaMoneyMarket} = contracts;

  const sendWithdraw = async () => {
    if (context.account && metaMoneyMarket) {
      setIsLoading(true);
      setError(null);
      try {
        const tokenShareAddress = await metaMoneyMarket.getTokenShare(market.address);
        const tokenShare = await IERC20.at(tokenShareAddress);

        const allowance: BN = await tokenShare.allowance(context.account, metaMoneyMarket.address);

        let amountToBurn: BN;
        if (maxEnabled) {
          amountToBurn = await tokenShare.balanceOf(context.account);
        } else {
          const exchangeRate = await metaMoneyMarket.getExchangeRate(market.address);
          const tokenSupply = exchangeRate[0];
          const tokenShareSupply = exchangeRate[1];
          amountToBurn = (amount || new BN(0)).mul(tokenShareSupply).divRound(tokenSupply);
        }

        if (allowance.lt(amountToBurn)) {
          await tokenShare.approve(metaMoneyMarket.address, '-1', {from: context.account});
        }

        await metaMoneyMarket.withdraw(market.address, amountToBurn.toString(), {
          from: context.account,
        });

        fetchMetaMoneyMarketData(contracts, context.account);
        if (onRequestClose) {
          onRequestClose();
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal {...restProps} style={modalStyle}>
      <ModalTitle title={`Withdraw ${market.symbol}`} onRequestClose={onRequestClose} />
      <FormRowsContainer>
        <FormRow text="Account" value={shortenAccount(context.account || '')} />
        <FormRow text={`Wallet ${market.symbol} Balance`} value={market.walletBalance.format()} />
        <FormRow text={`Deposited ${market.symbol}`} value={market.depositBalance.format()} />
        <FormRow
          text="Interest"
          value={`Earn ${market.interestRate.toFixed(4)}% APR`}
          valueColor={themeColors.primaryColorLighter}
        />
      </FormRowsContainer>
      <ModalSubtitle>Amount</ModalSubtitle>
      <AmountTextfield
        decimals={market.depositBalance.decimals}
        disabled={isLoading}
        max={market.depositBalance.amount}
        onMax={onMax}
        token={market.symbol || ''}
        value={amount}
        onChange={value => {
          setMaxEnabled(false);
          setAmount(value);
        }}
      />
      {isLoading ? (
        <LoadingStyled />
      ) : (
        <ModalNote>{error && <ModalNoteError>There was an error making the deposit.</ModalNoteError>}</ModalNote>
      )}
      <ButtonStyled disabled={isLoading || !amount || amount.isZero()} onClick={sendWithdraw}>
        Withdraw
      </ButtonStyled>
    </Modal>
  );
};

export default WithdrawModal;
