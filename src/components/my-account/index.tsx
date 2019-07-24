import React, {HTMLAttributes, useContext} from 'react';
import styled from 'styled-components';

import {ContractsContext} from '../../context/contracts';
import AccountBalance from '../my-account/AccountBalance';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: any;
}

interface State {
  modalIsOpen: boolean;
}

const AccountBalanceStyled = styled(AccountBalance)`
  margin: 0 0 55px;
`;

const MyAccount: React.FC<Props> = (props: Props) => {
  const {marketsData} = useContext(ContractsContext);

  return (
    <>
      <AccountBalanceStyled marketsData={marketsData} isLoggedIn={true} redirect={path => props.history.push(path)} />
    </>
  );
};

export default MyAccount;
