import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import ContentCenter from './ContentCenter';

import { themeColors, themeDimensions } from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ContentWrapperComponent = styled.div`
  color: ${themeColors.baseTextColor};
  flex-grow: 1;
  overflow: auto;
`;

const ContentCenterStyled = styled(ContentCenter)`
  padding: 45px ${themeDimensions.horizontalPadding};
`;

const ContentWrapper: React.FC<Props> = (props: Props) => {
  const { children, ...restProps } = props;

  return (
    <ContentWrapperComponent {...restProps}>
      <ContentCenterStyled>{children}</ContentCenterStyled>
    </ContentWrapperComponent>
  );
};

export default ContentWrapper;
