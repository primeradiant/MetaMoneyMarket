import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import React, {HTMLAttributes, useState, useEffect} from 'react';
import {Heading, Flex, Box, Card, Text} from 'rebass';
import styled, {css} from 'styled-components';
import {useWeb3Context} from 'web3-react';
import {themeColors} from '../../util/constants';
import {getTokenDataBySymbol} from '../common/img/token-icons';
import KyberLink from '../common/KyberLink';
import DepositModal from '../deposit';
import LoginModal from '../login';
import Container from '../ui/Container';
import Section from '../ui/Section';
import WithdrawModal from '../withdraw';
import TokenIcon from '../ui/TokenIcon';
import Skeleton from 'react-loading-skeleton';

interface Props extends HTMLAttributes<HTMLDivElement> {
  marketsData: Markets;
}

const cellCSS = css`
  border-bottom: 1px solid ${themeColors.borderColor};
  font-size: 15px;
  line-height: 1.2;
  padding: 8px 12px;
  white-space: nowrap;
`;

const TH = styled.th<{textAlign?: string; width: string}>`
  ${cellCSS}
  color: #444;
  font-weight: 600;
  text-align: ${props => props.textAlign};
  width: ${props => props.width};
`;

TH.defaultProps = {
  textAlign: 'right',
};

const TD = styled.td<{textAlign?: string}>`
  ${cellCSS}
  color: ${themeColors.tertiaryTextColor};
  font-feature-settings: 'tnum' 1;
  font-weight: 400;
  text-align: ${props => props.textAlign};
`;

TD.defaultProps = {
  textAlign: 'right',
};

const SkeletonAsset = () => (
  <Flex variant="asset-row" alignItems="center" mx={-1}>
    <Box flex={5 / 12} px={1}>
      <Flex alignItems="center">
        <Box mr={[2, 3]} height={24} width={24}>
          <Text lineHeight={1}>
            <Skeleton circle={true} height={24} width={24} />
          </Text>
        </Box>
        <Skeleton width={48} />
      </Flex>
    </Box>
    <Box flex={4 / 12} px={1}>
      <Text textAlign="right">
        <Skeleton width={48} />
      </Text>
    </Box>
    <Box flex={4 / 12} px={1}>
      <Text textAlign="right">
        <Skeleton width={48} />
      </Text>
    </Box>
    <Box flex={4 / 12} px={1}>
      <Text textAlign="right">
        <Skeleton width={64} />
      </Text>
    </Box>
    <Flex justifyContent="flex-end" flex={3 / 12} px={1}>
      <Skeleton width={72} />
    </Flex>
  </Flex>
);

const AssetKeys: React.FC<{
  keys: Array<{
    label: String;
    rightAligned?: Boolean;
  }>;
}> = ({keys}) => (
  <Box variant="card-inner-short" bg="muted-light">
    <Flex alignItems="center" mx={-1}>
      {keys.map((key, i) => (
        <Box key={i} flex={i === 0 ? 5 / 12 : i === keys.length - 1 ? 3 / 12 : 4 / 12} px={1}>
          <Text
            variant="headline"
            fontSize={['13px', '15px']}
            lineHeight={1}
            color="text.muted"
            textAlign={key.rightAligned && 'right'}
            sx={{whiteSpace: 'nowrap'}}
          >
            {key.label}
          </Text>
        </Box>
      ))}
    </Flex>
  </Box>
);

const AccountBalance: React.FC<Props> = ({marketsData}) => {
  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false);
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);
  const [loginModalIsOpen, setModalIsOpen] = useState(false);
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
  const closeLoginModal = () => setModalIsOpen(false);

  const deposit = (market: Market) => {
    openDepositModal();
    setCurrentMarket(market);
  };

  const withdraw = (market: Market) => {
    openWithdrawModal();
    setCurrentMarket(market);
  };

  const balanceHasLoaded =
    marketsData.length > 0 &&
    marketsData.filter(market => market.depositBalance !== undefined).length &&
    marketsData.filter(market => Object(market.depositBalance).hasOwnProperty('amount')).length
      ? true
      : false;

  const hasABalance = ({depositBalance}: Market) =>
    depositBalance && (Object(depositBalance).hasOwnProperty('amount') && !depositBalance.amount.isZero());

  const hasZeroBalance = (market: Market) =>
    market.depositBalance
      ? Object(market.depositBalance).hasOwnProperty('amount') && market.depositBalance.amount.isZero()
      : market;

  const userBalance =
    balanceHasLoaded &&
    marketsData
      .filter(hasABalance)
      .map(({depositBalance}) => !!depositBalance && Number(depositBalance.format()))
      .reduce((accumulator, currentValue) => Number(accumulator || 0) + Number(currentValue || 0));

  return (
    <>
      <Container>
        <Section variant="section-small">
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading as="h1" variant="h1">
              My Account
            </Heading>

            <Box>
              <KyberLink variant="small" tokenSymbol="DAI">
                Swap Tokens
              </KyberLink>
            </Box>
          </Flex>

          {context.account && (
            <Flex mb={5} mx={-3}>
              <Box px={3} flex={1 / 3}>
                <Card>
                  <Text mb={2} variant="headline">
                    Balance
                  </Text>
                  <Heading as="p" variant="h2">
                    {balanceHasLoaded ? `$${userBalance}` : <Skeleton width={128} />}
                  </Heading>
                </Card>
              </Box>
            </Flex>
          )}

          {context.account && balanceHasLoaded && (
            <>
              <Heading as="h2" variant="h2" mb={4}>
                Earning
              </Heading>
              <Card variant="card-outer" mb={5}>
                <AssetKeys
                  keys={[
                    {
                      label: 'Asset',
                    },
                    {
                      label: 'Price',
                      rightAligned: true,
                    },
                    {
                      label: 'Rate',
                      rightAligned: true,
                    },
                    {
                      label: 'Deposit Balance',
                      rightAligned: true,
                    },
                    {
                      label: ' ',
                    },
                  ]}
                />
                <Box variant="divider" />
                <Box variant="card-inner">
                  {marketsData.filter(hasABalance).map((market, index) => {
                    const tokenData = getTokenDataBySymbol(market.symbol);
                    const image = tokenData ? tokenData.image : '';
                    const depositBalance = market.depositBalance && market.depositBalance.format();

                    return (
                      <Flex key={index} variant="asset-row" alignItems="center" mx={-1}>
                        <Box flex={5 / 12} px={1}>
                          <Flex alignItems="center">
                            <TokenIcon image={image} mr={[2, 3]} />
                            <Text variant="headline">{market.symbol}</Text>
                          </Flex>
                        </Box>
                        <Box flex={4 / 12} px={1}>
                          <Text variant="body" textAlign="right">
                            {`$${market.price.toFixed(2)}`}
                          </Text>
                        </Box>
                        <Box flex={4 / 12} px={1}>
                          <Text variant="body" textAlign="right">
                            {`${market.interestRate.toFixed(2)}%`}
                          </Text>
                        </Box>
                        <Box flex={4 / 12} px={1}>
                          <Text variant="body" textAlign="right">
                            {depositBalance}
                          </Text>
                        </Box>
                        <Flex justifyContent="flex-end" flex={3 / 12} px={1}>
                          <button onClick={() => deposit(market)}>Deposit</button>
                          <button onClick={() => withdraw(market)}>Withdraw</button>
                        </Flex>
                      </Flex>
                    );
                  })}
                </Box>
              </Card>
            </>
          )}

          <Heading as="h2" variant="h2" mb={4}>
            Available
          </Heading>

          <Card variant="card-outer">
            <AssetKeys
              keys={[
                {
                  label: 'Asset',
                },
                {
                  label: 'Price',
                  rightAligned: true,
                },
                {
                  label: 'Rate',
                  rightAligned: true,
                },
                {
                  label: 'Wallet Balance',
                  rightAligned: true,
                },
                {
                  label: ' ',
                },
              ]}
            />
            <Box variant="divider" />
            <Box variant="card-inner">
              {!marketsData.length &&
                Array(3)
                  .fill('')
                  .map((el, index) => <SkeletonAsset key={index} />)}
              {marketsData.filter(hasZeroBalance).map((market, index) => {
                const tokenData = getTokenDataBySymbol(market.symbol);
                const image = tokenData ? tokenData.image : '';
                const walletBalance = market.walletBalance ? market.walletBalance.format() : '-';

                return (
                  <Flex key={index} variant="asset-row" alignItems="center" mx={-1}>
                    <Box flex={5 / 12} px={1}>
                      <Flex alignItems="center">
                        <TokenIcon image={image} mr={[2, 3]} />
                        <Text variant="headline">{market.symbol}</Text>
                      </Flex>
                    </Box>
                    <Box flex={4 / 12} px={1}>
                      <Text variant="body" textAlign="right">
                        {`$${market.price.toFixed(2)}`}
                      </Text>
                    </Box>
                    <Box flex={4 / 12} px={1}>
                      <Text variant="body" textAlign="right">
                        {`${market.interestRate.toFixed(2)}%`}
                      </Text>
                    </Box>
                    <Box flex={4 / 12} px={1}>
                      <Text variant="body" textAlign="right">
                        {walletBalance}
                      </Text>
                    </Box>
                    <Flex justifyContent="flex-end" flex={3 / 12} px={1}>
                      <button onClick={() => deposit(market)}>Start Earning</button>
                    </Flex>
                  </Flex>
                );
              })}
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
