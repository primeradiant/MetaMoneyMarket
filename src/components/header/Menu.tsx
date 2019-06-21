import React, { HTMLAttributes } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import LoginModal from '../login';

import { themeColors, themeDimensions } from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {}

interface State {
  modalIsOpen: boolean;
}

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

class Menu extends React.Component<Props, State> {
  public state = {
    modalIsOpen: false,
  };

  public render = () => {
    const { ...restProps } = this.props;
    return (
      <>
        <MenuContainer {...restProps}>
          <MenuItemLink activeClassName="active" to="/help">
            Help
          </MenuItemLink>
          <MenuItem onClick={this.openModal}>Login</MenuItem>
        </MenuContainer>
        <LoginModal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} />
      </>
    );
  };

  private openModal = (e: any) => {
    this.setState({
      modalIsOpen: true,
    });
  };

  private closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };
}

export default Menu;
