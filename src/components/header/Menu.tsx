import React, {HTMLAttributes, useState} from 'react';
// import {NavLink} from 'react-router-dom';
import styled, {css} from 'styled-components';
import {useWeb3Context} from 'web3-react';

import {LoginModal} from '../login';

import {themeColors, themeDimensions} from '../../util/constants';
import {useHistory} from 'react-router';

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

// const MenuItemLink = styled(NavLink)`
//   ${MenuItemCSS}
// `;

const Menu: React.FC<HTMLAttributes<HTMLDivElement>> = props => {
  const {...restProps} = props;
  const context = useWeb3Context();
  const history = useHistory();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const logout = () => {
    context.unsetConnector();
    history.push('/');
  };

  return (
    <>
      <MenuContainer {...restProps}>
        {!context.account && <MenuItem onClick={openModal}>Login</MenuItem>}
        {context.account && <MenuItem onClick={logout}>Logout</MenuItem>}
      </MenuContainer>
      <LoginModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </>
  );
};

export default Menu;
