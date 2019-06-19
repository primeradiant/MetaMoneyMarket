import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors, themeDimensions } from '../../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardBaseWrapper = styled.div`
  background-color: ${themeColors.cardBackgroundColor};
  border-radius: ${themeDimensions.commonBorderRadius};
  box-shadow: ${themeColors.commonBoxShadow};
  color: ${themeColors.baseTextColor};
  padding: ${themeDimensions.verticalPadding} ${themeDimensions.horizontalPadding};
`;

const CardBase: React.FC<Props> = (props: Props) => {
  const { children, ...restProps } = props;

  return <CardBaseWrapper {...restProps}>{children}</CardBaseWrapper>;
};

export default CardBase;
