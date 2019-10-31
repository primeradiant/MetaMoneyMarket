import React, {HTMLAttributes, useState} from 'react';
import {Card} from 'rebass';
import styled, {css} from 'styled-components';
import {useWeb3Context} from 'web3-react';
import {themeColors, themeDimensions} from '../../util/constants';
import ButtonLine from '../common/ButtonLine';
import {getTokenDataBySymbol} from '../common/img/token-icons';
import KyberLink from '../common/KyberLink';
import DepositModal from '../deposit';
import {LoginModal} from '../login';
import WithdrawModal from '../withdraw';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isLoggedIn: boolean;
  marketsData: Markets;
  redirect: (path: string) => void;
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

const TokenImage = styled.div<{image: any}>`
  background-image: url('${props => props.image}');
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: contain;
  flex-grow: 0;
  flex-shrink: 0;
  height: 25px;
  margin-right: 15px;
  width: 25px;
`;

const Title = styled.h1`
  color: ${themeColors.baseTextColor};
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
`;

const GetToken = styled(KyberLink)`
  color: ${themeColors.primaryColor};
  min-width: 55px;
`;

const GetTokens = styled(KyberLink)`
  margin-left: 20px;
  align-items: center;
  background-color: #fff;
  border-radius: ${themeDimensions.commonBorderRadius};
  border: 1px solid ${themeColors.primaryColor};
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.05);
  color: ${themeColors.primaryColor};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  height: 23px;
  justify-content: center;
  outline: none;
  text-align: center;
  transition: box-shadow 0.15s ease-out;
  white-space: nowrap;
  line-height: 0;

  &:hover {
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  }

  &[disabled] {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
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

const AccountBalance: React.FC<Props> = (props: Props) => {
  const {marketsData, isLoggedIn, ...restProps} = props;
  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false);
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);
  const [loginModalIsOpen, setModalIsOpen] = useState(false);
  const [currentMarket, setCurrentMarket] = useState<Market | null>(null);

  const context = useWeb3Context();

  const openDepositModal = () => setDepositModalIsOpen(true);
  const closeDepositModal = () => setDepositModalIsOpen(false);
  const openWithdrawModal = () => setWithdrawModalIsOpen(true);
  const closeWithdrawModal = () => setWithdrawModalIsOpen(false);
  const openLoginModal = () => {
    if (context.account) {
      props.redirect('/my-account');
    }
    setModalIsOpen(true);
  };
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
      <Card {...restProps} sx={{width: 1100, margin: 'auto'}}>
        <Title>
          <span>
            My Account{' '}
            <GetTokens tokenSymbol="DAI" className="kyber-widget-button theme-emerald theme-supported">
              Swap Tokens
            </GetTokens>
          </span>
        </Title>
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
                const hasBalance = market.walletBalance && !market.walletBalance.amount.isZero();

                return (
                  <TR key={index}>
                    <TD textAlign="left">
                      <TokenData>
                        <TokenImage image={image} />
                        <strong>{market.symbol}</strong>
                      </TokenData>
                    </TD>
                    <TD>${market.price}</TD>
                    <TD>{market.interestRate}%</TD>
                    <TD>{market.walletBalance ? market.walletBalance.format() : '-'}</TD>
                    <TD>{market.depositBalance ? market.depositBalance.format() : '-'}</TD>
                    <TD>
                      <ButtonsContainer>
                        {hasBalance ? (
                          <ButtonLine onClick={() => deposit(market)}>Deposit</ButtonLine>
                        ) : (
                          <ButtonLine>
                            <GetToken tokenSymbol={market.symbol}>Swap {market.symbol}</GetToken>
                          </ButtonLine>
                        )}
                        <ButtonLine onClick={() => withdraw(market)}>Withdraw</ButtonLine>{' '}
                      </ButtonsContainer>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </TableOverflow>
        <DepositModal market={currentMarket} isOpen={depositModalIsOpen} onRequestClose={closeDepositModal} />
        <WithdrawModal market={currentMarket} isOpen={withdrawModalIsOpen} onRequestClose={closeWithdrawModal} />
        <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} redirect={props.redirect} />
      </Card>
    </>
  );
};

export default AccountBalance;
