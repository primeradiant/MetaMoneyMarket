import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

import ContentCenter from './ContentCenter';

import {themeColors, themeDimensions} from '../../util/constants';

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

const Footer = styled.div`
  background-color: #fff;
  text-align: center;
  padding: 0.5em 0;
`;

const ContentWrapper: React.FC<Props> = (props: Props) => {
  const {children, ...restProps} = props;

  return (
    <ContentWrapperComponent {...restProps}>
      <ContentCenterStyled>{children}</ContentCenterStyled>
      <Footer>
        Data provided by <a href="https://nomics.com/">Nomics</a>
      </Footer>
    </ContentWrapperComponent>
  );
};

export default ContentWrapper;
