import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints, themeColors, themeDimensions } from '../util/constants';

import Logo from '../common/img/Logo';

interface OwnProps {}

type Props = OwnProps;

const HeaderContainer = styled.div`
  background-color: ${themeColors.headerBackgroundColor};
  box-shadow: 0 1px 10px 0 rgba(115, 105, 200, 0.16);
  height: ${themeDimensions.headerHeight};
`;

const HeaderContent = styled.div`
  align-items: center;
  color: ${themeColors.headerTextColor};
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${themeBreakPoints.xxl};
  min-height: 100%;
  padding: 0 ${themeDimensions.horizontalPadding};
  width: 100%;
`;

const Header = (props: Props) => {
  const { ...restProps } = props;

  return (
    <HeaderContainer {...restProps}>
      <HeaderContent>
        <Logo />
        <div>Buttons</div>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
