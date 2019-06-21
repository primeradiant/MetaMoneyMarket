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

interface Props extends HTMLAttributes<HTMLDivElement> {}

const ConnectionStatus: React.FC<Props> = (props: Props) => {
  const { ...restProps } = props;
  const accountAddress = '0x1234...5678';
  const status: string = accountAddress ? 'active' : '';

  return (
    <ConnectionStatusWrapper {...restProps}>
      <ConnectionStatusDotStyled status={status} />
      <ConnectionStatusText>{accountAddress}</ConnectionStatusText>
    </ConnectionStatusWrapper>
  );
};

export default ConnectionStatus;
