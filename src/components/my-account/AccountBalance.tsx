import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import React, {HTMLAttributes, useState} from 'react';
import {Heading, Button} from 'rebass';
import styled, {css} from 'styled-components';
import {useWeb3Context} from 'web3-react';
import {themeColors} from '../../util/constants';
import {getTokenDataBySymbol} from '../common/img/token-icons';
import KyberLink from '../common/KyberLink';
import DepositModal from '../deposit';
import {LoginModal} from '../login';
import Container from '../ui/Container';
import Section from '../ui/Section';
import WithdrawModal from '../withdraw';
import TokenIcon from '../ui/TokenIcon';

interface Props extends HTMLAttributes<HTMLDivElement> {
  marketsData: Markets;
}

interface State {
  depositModalIsOpen: boolean;
  withdrawModalIsOpen: boolean;
}

const Table = styled.table`
  margin: 15px auto;
  max-width: 1100px;
`;

const TR = styled.tr`
  &:last-child {
    > td {
      border-bottom: none;
    }
  }
`;

const THead = styled.thead``;
const TBody = styled.tbody``;

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

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  max-width: 200px;

  > button {
    margin-left: 10px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const TableOverflow = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const TokenData = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;

const TableLoading = () => (
  <>
    {Array(3)
      .fill('')
      .map((el, i) => (
        <TR key={i}>
          {Array(6)
            .fill('')
            .map((el, i) => (
              <TD key={i} textAlign="left">
                <span style={{color: '#d5d5d5'}}>—</span>
              </TD>
            ))}
        </TR>
      ))}
  </>
);

const AccountBalance: React.FC<Props> = ({marketsData}) => {
  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false);
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);
  const [loginModalIsOpen, setModalIsOpen] = useState(false);
  const [currentMarket, setCurrentMarket] = useState<Market | null>(null);

  const context = useWeb3Context();

  console.log(context);

  if (context.error) {
    console.error('Error!');
  }

  if (context.active && context.connectorName === 'WalletConnect') {
    if (!context.account) {
      WalletConnectQRCodeModal.open(context.connector.walletConnector.uri, () => {});
    } else {
      try {
        WalletConnectQRCodeModal.close();
      } catch {}
    }
  }

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

  return (
    <>
      <Container>
        <Section>
          <Heading as="h1" variant="h1" mb={4}>
            My Account
          </Heading>

          <KyberLink tokenSymbol="DAI">Swap Tokens</KyberLink>

          <TableOverflow>
            <Table>
              <THead>
                <TR>
                  <TH textAlign="left" width="20%">
                    Asset
                  </TH>
                  <TH width="15%">Price</TH>
                  <TH width="15%">Interest Rate</TH>
                  <TH width="15%">Wallet Balance</TH>
                  <TH width="15%">Deposit Balance</TH>
                  <TH width="20%">&nbsp;</TH>
                </TR>
              </THead>
              <TBody>
                {marketsData.length === 0 && <TableLoading />}
                {marketsData.map((market, index) => {
                  const tokenData = getTokenDataBySymbol(market.symbol);
                  const image = tokenData ? tokenData.image : '';

                  return (
                    <TR key={index}>
                      <TD textAlign="left">
                        <TokenData>
                          <TokenIcon mr={3} image={image} />
                          <strong>{market.symbol}</strong>
                        </TokenData>
                      </TD>
                      <TD>${market.price}</TD>
                      <TD>{market.interestRate}%</TD>
                      <TD>{market.walletBalance ? market.walletBalance.format() : '-'}</TD>
                      <TD>{market.depositBalance ? market.depositBalance.format() : '-'}</TD>
                      <TD>
                        <ButtonsContainer>
                          <Button onClick={() => deposit(market)}>Deposit</Button>
                          <Button onClick={() => withdraw(market)}>Withdraw</Button>{' '}
                        </ButtonsContainer>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableOverflow>
        </Section>
      </Container>
      <DepositModal market={currentMarket} isOpen={depositModalIsOpen} onRequestClose={closeDepositModal} />
      <WithdrawModal market={currentMarket} isOpen={withdrawModalIsOpen} onRequestClose={closeWithdrawModal} />
      <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} />
    </>
  );
};

export default AccountBalance;
