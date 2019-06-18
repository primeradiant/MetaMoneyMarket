import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints, themeColors, themeDimensions } from '../util/constants';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const ContentWrapperComponent = styled.div`
  color: ${themeColors.baseTextColor};
  margin: 0 auto;
  max-width: ${themeBreakPoints.xxl};
  padding: 0 ${themeDimensions.horizontalPadding};
  width: 100%;
`;

const ContentWrapper = (props: Props) => {
  const { children, ...restProps } = props;

  return <ContentWrapperComponent {...restProps}>
    {children}
  </ContentWrapperComponent>;
};

export default ContentWrapper;
