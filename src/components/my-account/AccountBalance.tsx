import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import React, {HTMLAttributes, useEffect, useState} from 'react';
import Skeleton from 'react-loading-skeleton';
import {useMedia} from 'react-use';
import {Box, Button, Card, Flex, Heading, Text} from 'rebass';
import {useWeb3Context} from 'web3-react';
import {getTokenDataBySymbol} from '../common/img/token-icons';
import KyberLink from '../common/KyberLink';
import SendwyreLink from '../common/SendwyreLink';
import DepositModal from '../deposit';
import LoginModal from '../login';
import Container from '../ui/Container';
import Section from '../ui/Section';
import TokenIcon from '../ui/TokenIcon';
import WithdrawModal from '../withdraw';
import {SkeletonAssets} from '../ui/LoadingScreens';

interface AccountBalanceProps extends HTMLAttributes<HTMLDivElement> {
  marketsData: Markets;
}

const FundingCard: React.FC<{destAddress: string}> = ({destAddress}) => {
  return (
    <Card variant="card-outer">
      <Box variant="card-inner">
        <Text variant="modal-title">Funding</Text>
      </Box>
      <Box variant="divider" />
      <Box variant="card-inner">
        <Text as="p">Purchase or swap your current cryptocurrency for others with our partners.</Text>
      </Box>
      <Box variant="divider" />
      <Box variant="card-inner-short">
        <KyberLink variant="text-small" tokenSymbol="DAI">
          Swap Tokens
        </KyberLink>
      </Box>
      <Box variant="divider" />
      <Box variant="card-inner-short">
        <SendwyreLink destAddress={destAddress} variant="text-small">
          Get Tokens
        </SendwyreLink>
      </Box>
    </Card>
  );
};

const hideOnTabletAndBelow = {
  display: ['none', null, 'block'],
};

const AssetRow: React.FC<{
  market: Market;
  showDepositBalance?: Boolean;
  withdrawAction: () => void;
  depositAction: () => void;
}> = ({market, showDepositBalance, withdrawAction, depositAction}) => {
  const [rowOpened, setRowOpened] = useState(false);
  const isWide = useMedia('(min-width: 52em)');

  const toggle = () => setRowOpened(!rowOpened);

  const tokenData = getTokenDataBySymbol(market.symbol);

  const image = tokenData ? tokenData.image : '';
  const depositBalance = market.depositBalance ? market.depositBalance.format() : '-';
  const walletBalance = market.walletBalance ? market.walletBalance.format() : '-';

  return (
    <Box variant="asset-row" onClick={isWide ? () => null : toggle}>
      <Flex variant="asset-grid-row">
        <Box variant="asset-grid-col">
          <Flex alignItems="center">
            <TokenIcon image={image} mr={[2, 3]} />
            <Text variant="headline">{market.symbol}</Text>
          </Flex>
        </Box>
        <Box variant="asset-grid-col" sx={showDepositBalance ? hideOnTabletAndBelow : {}}>
          <Text variant="body" textAlign="right">
            {`$${market.price.toFixed(2)}`}
          </Text>
        </Box>
        <Box variant="asset-grid-col">
          <Text variant="body" textAlign="right">
            {`${market.interestRate.toFixed(2)}%`}
          </Text>
        </Box>
        <Box variant="asset-grid-col" sx={!showDepositBalance ? hideOnTabletAndBelow : {}}>
          <Text variant="body" textAlign="right">
            {showDepositBalance ? depositBalance : walletBalance}
          </Text>
        </Box>
        <Box variant="asset-grid-col" flex={1.2} sx={hideOnTabletAndBelow}>
          <Flex justifyContent="flex-end" alignItems="center">
            <Button variant="text-small" mr={showDepositBalance && 24} onClick={() => depositAction()}>
              {showDepositBalance ? 'Deposit' : 'Start Earning'}
            </Button>
            {showDepositBalance && (
              <Button variant="text-small" onClick={() => withdrawAction()}>
                Withdraw
              </Button>
            )}
          </Flex>
        </Box>
      </Flex>
      {!isWide && rowOpened && (
        <>
          <Box variant="divider" mt={[14, 22]} />
          <Box pt={[14, 22]}>
            {showDepositBalance && (
              <>
                <Flex justifyContent="space-between">
                  <Text variant="headline">Price</Text>
                  <Text variant="body">{`$${market.price.toFixed(2)}`}</Text>
                </Flex>
              </>
            )}

            <Flex justifyContent="space-between" mt={showDepositBalance && 3}>
              <Text variant="headline">Wallet Balance</Text>
              <Text variant="body">{walletBalance}</Text>
            </Flex>

            <Flex justifyContent="space-between" mt={3}>
              <Text variant="headline">Deposit more</Text>
              <Text variant="body">
                <Button variant="text-small" onClick={() => depositAction()}>
                  {showDepositBalance ? 'Deposit' : 'Start Earning'}
                </Button>
              </Text>
            </Flex>

            {showDepositBalance && (
              <Flex justifyContent="space-between" mt={3}>
                <Text variant="headline">Withdraw deposit</Text>
                <Text variant="body">
                  <Button variant="text-small" onClick={() => withdrawAction()}>
                    Withdraw
                  </Button>
                </Text>
              </Flex>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

AssetRow.defaultProps = {
  showDepositBalance: false,
};

const AccountBalance: React.FC<AccountBalanceProps> = ({marketsData}) => {
  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false);
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

  const [currentMarket, setCurrentMarket] = useState<Market | null>(null);

  const context = useWeb3Context();

  if (context.error) {
    console.error('Error!');
  }

  useEffect(() => {
    if (context.active && context.connectorName === 'WalletConnect') {
      if (!context.account) {
        WalletConnectQRCodeModal.open(context.connector.walletConnector.uri, () => {});
      } else {
        try {
          WalletConnectQRCodeModal.close();
        } catch {}
      }
    }
  }, [context]);

  const openDepositModal = () => setDepositModalIsOpen(true);
  const closeDepositModal = () => setDepositModalIsOpen(false);
  const openWithdrawModal = () => setWithdrawModalIsOpen(true);
  const closeWithdrawModal = () => setWithdrawModalIsOpen(false);
  const openLoginModal = () => setWithdrawModalIsOpen(true);
  const closeLoginModal = () => setLoginModalIsOpen(false);

  const deposit = (market: Market) => {
    openDepositModal();
    setCurrentMarket(market);
  };

  const withdraw = (market: Market) => {
    openWithdrawModal();
    setCurrentMarket(market);
  };

  /**
   * @name balanceHasLoaded
   * @description Probably over-complicated check to test to see if after a user has logged in, to see if the balance of the available tokens on MMM has loaded
   *
   * @returns {Boolean}
   */
  const balanceHasLoaded =
    marketsData.length > 0 &&
    marketsData.filter(market => market.depositBalance !== undefined).length &&
    marketsData.filter(market => Object(market.depositBalance).hasOwnProperty('amount')).length
      ? true
      : false;

  /**
   * @name hasABalance
   */
  const hasABalance = ({depositBalance}: Market) =>
    depositBalance && (Object(depositBalance).hasOwnProperty('amount') && !depositBalance.amount.isZero());

  /**
   * @name hasZeroBalance
   */
  const hasZeroBalance = (market: Market) =>
    market.depositBalance
      ? Object(market.depositBalance).hasOwnProperty('amount') && market.depositBalance.amount.isZero()
      : market;

  /**
   * @name userBalance
   */
  const userBalance =
    balanceHasLoaded &&
    marketsData
      .filter(hasABalance)
      .map(({depositBalance, price}) => !!depositBalance && Number(depositBalance.format()) * price)
      .reduce((accumulator, currentValue) => Number(accumulator || 0) + Number(currentValue || 0));

  return (
    <>
      <Container>
        <Section variant="section-small">
          <Heading as="h1" variant="h1" mb={4}>
            My Account
          </Heading>

          {context.account && (
            <Flex mb={[4, 5]} mx={[-2, -3]} flexWrap="wrap">
              <Box px={[2, 3]} width={[1, 1 / 2]} mb={[3, 0]}>
                <Card variant="card-outer" height="100%">
                  <Box variant="card-inner">
                    <Text variant="modal-title">Total Balance</Text>
                  </Box>
                  <Box variant="divider" />
                  <Box variant="card-inner">
                    <Heading as="p" variant="h2" mt={'auto'}>
                      {balanceHasLoaded ? `$${Number(userBalance).toFixed(2)}` : <Skeleton width={128} />}
                    </Heading>
                  </Box>
                </Card>
              </Box>
              <Box px={[2, 3]} width={[1, 1 / 2]}>
                <FundingCard destAddress={context.account} />
              </Box>
            </Flex>
          )}

          {context.account && balanceHasLoaded && (
            <>
              <Heading as="h2" variant="h2" mb={[3, 4]}>
                Earning
              </Heading>
              <Card variant="card-outer" mb={[4, 5]}>
                <Box variant="card-inner-short" bg="muted-light">
                  <Flex variant="asset-grid-row">
                    <Box variant="asset-grid-col">
                      <Text variant="asset-key-label">Asset</Text>
                    </Box>
                    <Box variant="asset-grid-col" sx={hideOnTabletAndBelow}>
                      <Text variant="asset-key-label" textAlign="right">
                        Price
                      </Text>
                    </Box>
                    <Box variant="asset-grid-col">
                      <Text variant="asset-key-label" textAlign="right">
                        Rate
                      </Text>
                    </Box>
                    <Box variant="asset-grid-col">
                      <Text variant="asset-key-label" textAlign="right">
                        Deposit Balance
                      </Text>
                    </Box>
                    <Box variant="asset-grid-col" flex={1.2} sx={hideOnTabletAndBelow}>
                      <Text variant="asset-key-label">&nbsp;</Text>
                    </Box>
                  </Flex>
                </Box>
                <Box variant="divider" />
                <Box variant="card-inner">
                  {marketsData.filter(hasABalance).map((market, index) => (
                    <AssetRow
                      key={index}
                      market={market}
                      showDepositBalance
                      depositAction={() => deposit(market)}
                      withdrawAction={() => withdraw(market)}
                    />
                  ))}
                </Box>
              </Card>
            </>
          )}

          <Heading as="h2" variant="h2" mb={[3, 4]}>
            Available
          </Heading>

          <Card variant="card-outer">
            <Box variant="card-inner-short" bg="muted-light">
              <Flex variant="asset-grid-row">
                <Box variant="asset-grid-col">
                  <Text variant="asset-key-label">Asset</Text>
                </Box>
                <Box variant="asset-grid-col">
                  <Text variant="asset-key-label" textAlign="right">
                    Price
                  </Text>
                </Box>
                <Box variant="asset-grid-col">
                  <Text variant="asset-key-label" textAlign="right">
                    Rate
                  </Text>
                </Box>
                <Box variant="asset-grid-col" sx={hideOnTabletAndBelow}>
                  <Text variant="asset-key-label" textAlign="right">
                    Wallet Balance
                  </Text>
                </Box>
                <Box variant="asset-grid-col" flex={1.2} sx={hideOnTabletAndBelow}>
                  <Text variant="asset-key-label">&nbsp;</Text>
                </Box>
              </Flex>
            </Box>
            <Box variant="divider" />
            <Box variant="card-inner">
              {!marketsData.length && <SkeletonAssets />}
              {marketsData.filter(hasZeroBalance).map((market, index) => (
                <AssetRow
                  key={index}
                  market={market}
                  depositAction={() => deposit(market)}
                  withdrawAction={() => withdraw(market)}
                />
              ))}
            </Box>
          </Card>
        </Section>
      </Container>
      <DepositModal market={currentMarket} isOpen={depositModalIsOpen} onRequestClose={closeDepositModal} />
      <WithdrawModal market={currentMarket} isOpen={withdrawModalIsOpen} onRequestClose={closeWithdrawModal} />
      <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} />
    </>
  );
};

export default AccountBalance;
