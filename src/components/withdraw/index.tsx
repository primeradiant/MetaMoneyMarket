import { Label } from '@rebass/forms';
import BN from 'bn.js';
import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { Box, Button, Flex, Text } from 'rebass';
import { useWeb3Context } from 'web3-react';
import { ContractsContext } from '../../context/contracts';
import { modalStyle } from '../../util/constants';
import { shortenAccount } from '../../util/utils';
import AmountTextfield from '../amount-textfield';
import ModalTitle from '../modal-title';
import LoadingSpinner from '../ui/LoadingSpinner';

interface Props {
  market: null | Market;
  isOpen: boolean;
  onRequestClose: () => void;
}

const WithdrawModal: React.FC<Props> = props => {
  const { onRequestClose, market, ...restProps } = props;

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
  const { contracts, fetchMetaMoneyMarketData } = useContext(ContractsContext);

  if (!market || !contracts || !market.depositBalance || !market.walletBalance) {
    return <div />;
  }

  const { IERC20, metaMoneyMarket } = contracts;

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
          await tokenShare.approve(metaMoneyMarket.address, '-1', { from: context.account });
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
      <Box variant="modal-card-inner">
        <Box mb={24}>
          <Flex variant="modal-data-row">
            <Text variant="headline-small">Account</Text>
            <Text variant="body-small">{shortenAccount(context.account || '')}</Text>
          </Flex>

          <Flex variant="modal-data-row">
            <Text variant="headline-small">{`Available ${market.symbol}`}</Text>
            <Text variant="body-small">{market.walletBalance.format()}</Text>
          </Flex>

          <Flex variant="modal-data-row">
            <Text variant="headline-small">{`Deposited ${market.symbol}`}</Text>
            <Text variant="body-small">{market.depositBalance.format()}</Text>
          </Flex>

          <Flex variant="modal-data-row">
            <Text variant="headline-small">Interest</Text>
            <Text variant="body-small" color="primary" fontWeight={600}>
              {`Earn ${market.interestRate.toFixed(2)}% APR`}
            </Text>
          </Flex>
        </Box>

        <Label htmlFor="amount-text-field">Amount</Label>
        <AmountTextfield
          id="amount-text-field"
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

        <Box mt={24} mb={3}>
          <Flex justifyContent="center">
            <LoadingSpinner loading={isLoading} />
          </Flex>

          {error && <Text variant="modal-error">There was an error completing the withdrawal.</Text>}
        </Box>

        <Button width={1} disabled={isLoading || !amount} onClick={sendWithdraw}>
          Withdraw
        </Button>
      </Box>
    </Modal>
  );
};

export default WithdrawModal;
