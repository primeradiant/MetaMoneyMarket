import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

import { themeColors, themeDimensions } from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const MenuContainer = styled.div`
  display: flex;
`;

const MenuItemCSS = css`
  align-items: center;
  border-bottom: solid 4px transparent;
  color: ${themeColors.headerTextColor};
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  height: ${themeDimensions.headerHeight};
  line-height: 1.38;
  margin: 0 10px;
  text-decoration: none;
  user-select: none;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &.active,
  &:hover {
    border-bottom-color: ${themeColors.primaryColor};
  }
`;

const MenuItem = styled.div`
  ${MenuItemCSS}
`;

const MenuItemLink = styled(NavLink)`
  ${MenuItemCSS}
`;

const Menu: React.FC<Props> = (props: Props) => {
  const { ...restProps } = props;

  return (
    <MenuContainer {...restProps}>
      <MenuItemLink activeClassName='active' to="/help">Help</MenuItemLink>
      <MenuItem>Login</MenuItem>
    </MenuContainer>
  );
};

export default Menu;
