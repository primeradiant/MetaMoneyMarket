import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { ConnectionStatusDot } from '../common/ConnectionStatusDot';

import { themeColors } from '../../util/constants';

const ConnectionStatusWrapper = styled.div`
  align-items: center;
  border-left: 1px solid ${themeColors.borderColor};
  display: flex;
  margin-left: 15px;
  padding-left: 15px;
`;

const ConnectionStatusDotStyled = styled(ConnectionStatusDot)`
  margin-right: 10px;
`;

const ConnectionStatusText = styled.span`
  color: ${themeColors.headerTextColor};
  font-size: 14px;
  font-weight: 600;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  account: string;
  active: boolean;
}

const ConnectionStatus: React.FC<Props> = (props: Props) => {
  const { account, active, ...restProps } = props;

  const shortenedAccount = account.slice(0, 6) + '...' + account.slice(account.length - 4);

  return (
    <ConnectionStatusWrapper {...restProps}>
      <ConnectionStatusDotStyled status={active} />
      <ConnectionStatusText>{shortenedAccount}</ConnectionStatusText>
    </ConnectionStatusWrapper>
  );
};

export default ConnectionStatus;
