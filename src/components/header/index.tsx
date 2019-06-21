import React, { HTMLAttributes } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '../common/img/Logo';
import Menu from './Menu';

import { themeBreakPoints, themeColors, themeDimensions } from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const LogoWrapper = styled(NavLink)``;

const HeaderContainer = styled.div`
  background-color: ${themeColors.headerBackgroundColor};
  box-shadow: 0 1px 10px 0 rgba(115, 105, 200, 0.16);
  flex-grow: 0;
  flex-shrink: 0;
  height: ${themeDimensions.headerHeight};
  position: sticky;
  top: 0;
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

const Header: React.FC<Props> = (props: Props) => {
  const { ...restProps } = props;

  return (
    <HeaderContainer {...restProps}>
      <HeaderContent>
        <LogoWrapper to="/">
          <Logo />
        </LogoWrapper>
        <Menu />
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
