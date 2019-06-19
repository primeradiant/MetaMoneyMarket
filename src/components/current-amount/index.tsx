import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import Card from '../common/card';
import CardBase from '../common/card/CardBase';
import ChevronDown from '../common/img/ChevronDown';
import { Dropdown, DropdownPositions } from '../dropdown';

import { themeColors, themeDimensions } from '../../util/constants';

import BAT from './icons/bat.png';
import DAI from './icons/dai.png';
import ETH from './icons/eth.png';
import KNC from './icons/knc.png';
import LINK from './icons/link.png';
import MKR from './icons/mkr.png';
import REP from './icons/rep.png';
import TUSD from './icons/tusd.png';
import USDC from './icons/usdc.png';
import WBTC from './icons/wbtc.png';
import ZRX from './icons/zrx.png';

interface State {
  selectedToken: number;
}

const tokensList = [
  {
    image: BAT,
    title: 'BAT',
    text: 'Basic Attention',
  },
  {
    image: DAI,
    title: 'DAI',
    text: 'DAI',
  },
  {
    image: ETH,
    title: 'ETH',
    text: 'Ethereum',
  },
  {
    image: KNC,
    title: 'KNC',
    text: 'Kyber',
  },
  {
    image: LINK,
    title: 'LINK',
    text: 'Chainlink',
  },
  {
    image: MKR,
    title: 'MKR',
    text: 'Maker',
  },
  {
    image: REP,
    title: 'REP',
    text: 'Augur',
  },
  {
    image: TUSD,
    title: 'TUSD',
    text: 'True USD',
  },
  {
    image: USDC,
    title: 'USDC',
    text: 'USD Coin',
  },
  {
    image: WBTC,
    title: 'WBTC',
    text: 'Wrapper BTC',
  },
  {
    image: ZRX,
    title: 'ZRX',
    text: '0x',
  },
];

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TokenRow = styled.div`
  align-items: center;
  display: flex;
  padding-bottom: 20px;
  padding-top: 25px;
`;

const TokenImage = styled.div<{ image: any }>`
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('${props => props.image}');
  flex-grow: 0;
  flex-shrink: 0;
  height: 50px;
  width: 50px;
`;

const CurrentValue = styled.div`
  color: ${themeColors.tertiaryTextColor};
  flex-grow: 1;
  font-size: 24px;
  font-weight: normal;
  line-height: 1.2;
  margin-left: 35px;
  margin-right: 15px;
`;

const DropdownButton = styled.div`
  align-items: center;
  display: flex;
  margin-left: auto;
  margin-right: 10px;
  user-select: none;
`;

const DropdownButtonText = styled.span`
  color: ${themeColors.tertiaryTextColor};
  flex-grow: 1;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.2;
  margin-right: 10px;
  text-align: left;
`;

const DropdownBody = styled(CardBase)`
  width: 220px;
`;

const DropdownBodyItem = styled.div`
  color: ${themeColors.tertiaryTextColor};
  cursor: pointer;
  flex-grow: 1;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin-left: -${themeDimensions.horizontalPadding};
  margin-right: -${themeDimensions.horizontalPadding};
  padding: 8px ${themeDimensions.horizontalPadding};
  user-select: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

class CurrentAmount extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedToken: 0,
    };
  }

  public render = () => {
    const { ...restProps } = this.props;

    return (
      <Card title="Account Balance" {...restProps}>
        <TokenRow>
          <TokenImage image={this._getTokenImage()} />
          <CurrentValue>${11111.11 * (this.state.selectedToken + 1)}</CurrentValue>
          <Dropdown
            body={this._getDropdownList()}
            header={this._getDropdownButton()}
            horizontalPosition={DropdownPositions.Right}
          />
        </TokenRow>
      </Card>
    );
  };

  private _getDropdownButton = (): React.ReactNode => {
    return (
      <DropdownButton>
        <DropdownButtonText>{tokensList[this.state.selectedToken].title}</DropdownButtonText>
        <ChevronDown />
      </DropdownButton>
    );
  };

  private _getDropdownList = (): React.ReactNode => {
    const itemsList = tokensList.map((item, index) => {
      return (
        <DropdownBodyItem key={index} onClick={() => this._setToken(index)}>
          <strong>{item.title}</strong> - {item.text}
        </DropdownBodyItem>
      );
    });
    return <DropdownBody>{itemsList}</DropdownBody>;
  };

  private _setToken = (index: number)  => {
    this.setState({ selectedToken: index});
  };

  private _getTokenImage = (): string => {
    return tokensList[this.state.selectedToken].image;
  };
}

export default CurrentAmount;
