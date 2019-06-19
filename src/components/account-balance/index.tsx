import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import Card from '../common/card';
import ButtonLine from '../common/ButtonLine';

import { themeColors } from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Table = styled.table`
  margin-bottom: 15px;
  margin-top: 15px;
  width: 100%;
`;

const TR = styled.tr``;
const THead = styled.thead``;
const TBody = styled.tbody``;

const cellCSS = css`
  border-bottom: 1px solid ${themeColors.borderColor};
  font-size: 15px;
  line-height: 1.2;
  padding: 8px 15px;
  white-space: nowrap;
`;

const TH = styled.th<{ textAlign?: string }>`
  ${cellCSS}

  color: #444;
  font-weight: 600;
  text-align: ${props => props.textAlign};
`;

TH.defaultProps = {
  textAlign: 'center',
};

const TD = styled.td<{ textAlign?: string }>`
  ${cellCSS}
  color: ${themeColors.tertiaryTextColor};
  font-weight: 400;
  text-align: ${props => props.textAlign};
`;

TD.defaultProps = {
  textAlign: 'right',
};

const ButtonsContainer = styled.div`
  column-gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-left: auto;
  max-width: 215px;
`;

const TableOverflow = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const tableData = [
  {
    asset: 'DAI',
    balance: '99999.99',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '0.0000',
  },
  {
    asset: 'ETH',
    balance: '500.25',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '10.0015',
  },
  {
    asset: 'xDAI',
    balance: '0.15',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '999.0099',
  },
  {
    asset: 'USDC',
    balance: '123.45',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '23.3265',
  },
  {
    asset: 'FIAT',
    balance: '10.00',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '0.3366',
  },
  {
    asset: 'BAT',
    balance: '56.65',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '88.8888',
  },
  {
    asset: 'KNC',
    balance: '22.11',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '55.6666',
  },
  {
    asset: 'REP',
    balance: '23.21',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '44.3216',
  },
  {
    asset: 'WBTC',
    balance: '0.88',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '78.7896',
  },
  {
    asset: 'ZRX',
    balance: '0.68',
    interestRate: 'Earn 0.01% / Pay 0.34%',
    price: '32321.3366',
  },
];

const AccountBalance: React.FC<Props> = (props: Props) => {
  return (
    <Card title="Account Balance">
      <TableOverflow>
        <Table>
          <THead>
            <TR>
              <TH textAlign="left">Asset</TH>
              <TH>Price</TH>
              <TH>Interest Rate (APR)</TH>
              <TH>Balance</TH>
              <TH>&nbsp;</TH>
            </TR>
          </THead>
          <TBody>
            {tableData.map((item, index) => {
              return (
                <TR key={index}>
                  <TD textAlign="left"><strong>{item.asset}</strong></TD>
                  <TD>${item.price}</TD>
                  <TD textAlign="center">{item.interestRate}</TD>
                  <TD>{item.balance}</TD>
                  <TD>
                    <ButtonsContainer>
                      <ButtonLine>Deposit</ButtonLine>
                      <ButtonLine>Withdraw</ButtonLine>
                    </ButtonsContainer>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </TableOverflow>
    </Card>
  );
};

export default AccountBalance;
