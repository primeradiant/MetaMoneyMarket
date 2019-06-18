import React from 'react';
import styled from 'styled-components';
import Header from '../header';
import ContentWrapper from './ContentWrapper';

import { themeColors } from '../util/constants';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const MainWrapperComponent = styled.div`
  background: ${themeColors.bodyBackground};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MainWrapper = (props: Props) => {
  const { children, ...restProps } = props;

  return <MainWrapperComponent {...restProps}>
    <Header />
    <ContentWrapper>{children}</ContentWrapper>
  </MainWrapperComponent>;
};

export default MainWrapper;
