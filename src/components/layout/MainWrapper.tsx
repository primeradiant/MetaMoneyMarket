import React, {HTMLAttributes} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
import Header from '../header';
import ContentWrapper from './ContentWrapper';

import {themeColors} from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MainWrapperComponent = styled.div`
  background: ${themeColors.bodyBackground};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

class BasicMainWrapper extends React.Component<Props> {
  public render() {
    const {children, ...restProps} = this.props;

    return (
      <MainWrapperComponent {...restProps}>
        <Header />
        <ContentWrapper>{children}</ContentWrapper>
      </MainWrapperComponent>
    );
  }
}

export const MainWrapper = withRouter(BasicMainWrapper as any);
