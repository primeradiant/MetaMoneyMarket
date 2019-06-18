import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints, themeColors, themeDimensions } from '../util/constants';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const ContentWrapperComponent = styled.div`
  color: ${themeColors.baseTextColor};
  flex-grow: 1;
  margin: 0 auto;
  max-width: ${themeBreakPoints.xxl};
  overflow: auto;
  padding: 45px ${themeDimensions.horizontalPadding};
  width: 100%;
`;

const ContentWrapper = (props: Props) => {
  const { children, ...restProps } = props;

  return <ContentWrapperComponent {...restProps}>
    {children}
  </ContentWrapperComponent>;
};

export default ContentWrapper;
