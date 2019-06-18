import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import Logo from '../common/img/Logo';
import Menu from './Menu';

import { themeBreakPoints, themeColors, themeDimensions } from '../util/constants';

interface OwnProps {}

type Props = OwnProps;

const LogoWrapper = styled(NavLink)``;

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

const Header: React.FC = (props: Props) => {
  const { ...restProps } = props;

  return (
    <HeaderContainer {...restProps}>
      <HeaderContent>
        <LogoWrapper to="/"><Logo /></LogoWrapper>
        <Menu />
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
