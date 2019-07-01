import React, {HTMLAttributes} from 'react';
import styled, {css} from 'styled-components';

import ButtonLine from '../common/ButtonLine';
import Card from '../common/card';
import {tokensList} from '../common/img/token-icons';
import DepositModal from '../deposit';
import MyTotalBalance from '../my-total-balance';
import WithdrawModal from '../withdraw';

import {themeColors} from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {}

interface State {
  depositModalIsOpen: boolean;
  withdrawModalIsOpen: boolean;
}

const Table = styled.table`
  margin-bottom: 15px;
  margin-top: 15px;
  width: 100%;
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

const TH = styled.th<{textAlign?: string}>`
  ${cellCSS}

  color: #444;
  font-weight: 600;
  text-align: ${props => props.textAlign};
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
  margin: 25px 0 0 0;
  padding: 25px 0 0 0;
  border-top: 1px solid ${themeColors.borderColor};
`;

const tableData = [
  {
    interestRate: 'Earn 0.01%',
    price: '0.0000',
    savingsBalance: '99.99',
    walletBalance: '99999.99',
  },
  {
    interestRate: 'Earn 1.01%',
    price: '10.0015',
    savingsBalance: '99.99',
    walletBalance: '500.25',
  },
  {
    interestRate: 'Earn 12.99%',
    price: '999.0099',
    savingsBalance: '99.99',
    walletBalance: '0.15',
  },
  {
    interestRate: 'Earn 0.01%',
    price: '23.3265',
    savingsBalance: '99.99',
    walletBalance: '123.45',
  },
  {
    interestRate: 'Earn 9.99%',
    price: '0.3366',
    savingsBalance: '99.99',
    walletBalance: '10.00',
  },
  {
    interestRate: 'Earn 0.01%',
    price: '88.8888',
    savingsBalance: '99.99',
    walletBalance: '56.65',
  },
  {
    interestRate: 'Earn 0.01%',
    price: '55.6666',
    savingsBalance: '99.99',
    walletBalance: '22.11',
  },
  {
    interestRate: 'Earn 0.01%',
    price: '44.3216',
    savingsBalance: '99.99',
    walletBalance: '23.21',
  },
  {
    interestRate: 'Earn 0.01%',
    price: '78.7896',
    savingsBalance: '99.99',
    walletBalance: '0.88',
  },
  {
    interestRate: 'Earn 0.01%',
    price: '32321.3366',
    savingsBalance: '99.99',
    walletBalance: '0.68',
  },
  {
    interestRate: 'Earn 0.01%',
    price: '32321.3366',
    savingsBalance: '99.99',
    walletBalance: '0.68',
  },
];

class AccountBalance extends React.Component<Props, State> {
  public state = {
    depositModalIsOpen: false,
    withdrawModalIsOpen: false,
  };

  public render = () => {
    const {...restProps} = this.props;

    return (
      <Card {...restProps}>
        <MyTotalBalance />
        <Title>My Account</Title>
        <TableOverflow>
          <Table>
            <THead>
              <TR>
                <TH textAlign="left">Asset</TH>
                <TH>Price</TH>
                <TH textAlign="left">Interest Rate</TH>
                <TH>Wallet Balance</TH>
                <TH>Savings Balance</TH>
                <TH>&nbsp;</TH>
              </TR>
            </THead>
            <TBody>
              {tokensList.map((item, index) => {
                return (
                  <TR key={index}>
                    <TD textAlign="left">
                      <TokenData>
                        <TokenImage image={item.image} />
                        <strong>{item.title}</strong>
                      </TokenData>
                    </TD>
                    <TD>${tableData[index].price}</TD>
                    <TD textAlign="left">{tableData[index].interestRate}</TD>
                    <TD>{tableData[index].walletBalance}</TD>
                    <TD>{tableData[index].savingsBalance}</TD>
                    <TD>
                      <ButtonsContainer>
                        <ButtonLine onClick={this.openDepositModal}>Deposit</ButtonLine>
                        <ButtonLine onClick={this.openWithdrawModal}>Withdraw</ButtonLine>
                      </ButtonsContainer>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </TableOverflow>
        <DepositModal token="TOKEN" isOpen={this.state.depositModalIsOpen} onRequestClose={this.closeDepositModal} />
        <WithdrawModal token="TOKEN" isOpen={this.state.withdrawModalIsOpen} onRequestClose={this.closeWithdrawModal} />
      </Card>
    );
  };

  private openDepositModal = (e: any) => {
    this.setState({
      depositModalIsOpen: true,
    });
  };

  private closeDepositModal = () => {
    this.setState({
      depositModalIsOpen: false,
    });
  };

  private openWithdrawModal = (e: any) => {
    this.setState({
      withdrawModalIsOpen: true,
    });
  };

  private closeWithdrawModal = () => {
    this.setState({
      withdrawModalIsOpen: false,
    });
  };
}

export default AccountBalance;
