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

const DepositModal: React.FC<Props> = props => {
  const { onRequestClose, market, ...restProps } = props;

  const [amount, setAmount] = useState<Maybe<BN>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxEnabled, setMaxEnabled] = useState(false);
  const [error, setError] = useState<Maybe<Error>>(null);

  const onMax = () => {
    setMaxEnabled(true);
    if (market && market.walletBalance) {
      setAmount(market.walletBalance.amount);
    }
  };

  const context = useWeb3Context();
  const { contracts, fetchMetaMoneyMarketData } = useContext(ContractsContext);

  if (!market || !contracts || !market.depositBalance || !market.walletBalance) {
    return <div />;
  }

  const { IERC20, metaMoneyMarket } = contracts;

  const sendDeposit = async () => {
    if (context.account && metaMoneyMarket) {
      setIsLoading(true);
      setError(null);
      try {
        const token = await IERC20.at(market.address);

        const allowance: BN = await token.allowance(context.account, metaMoneyMarket.address);
        const amountToDeposit: BN = maxEnabled ? market.walletBalance!.amount : amount || new BN(0);

        if (allowance.lt(amountToDeposit)) {
          await token.approve(metaMoneyMarket.address, '-1', { from: context.account });
        }

        await metaMoneyMarket.deposit(market.address, amountToDeposit.toString(), {
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
      <ModalTitle title={`Deposit ${market.symbol}`} onRequestClose={onRequestClose} />
      <Box variant="modal-card-inner">
        <Text variant="body-small" mb={3}>
          Deposit <strong>{market.symbol}</strong> and earn interest automatically.
        </Text>

        <Box mt={3} mb={24}>
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
          decimals={market.walletBalance.decimals}
          disabled={isLoading}
          max={market.walletBalance.amount}
          onMax={onMax}
          token={market.symbol || ''}
          value={amount}
          onChange={value => {
            setMaxEnabled(false);
            setAmount(value);
          }}
        />

        <Box my={24}>
          <Flex justifyContent="center">
            <LoadingSpinner loading={isLoading} />
          </Flex>

          {!isLoading && (
            <Text variant="modal-note">
              <strong>Note:</strong> we will first enable <strong>{market.symbol}</strong>, and then make the deposit.
            </Text>
          )}

          {error && (
            <Text variant="modal-error" mt={2}>
              There was an error making the deposit.
            </Text>
          )}
        </Box>

        <Button width={1} disabled={isLoading || !amount} onClick={sendDeposit}>
          Deposit
        </Button>
      </Box>
    </Modal>
  );
};

export default DepositModal;
