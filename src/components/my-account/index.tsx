import React, {HTMLAttributes, useContext} from 'react';
import {ContractsContext} from '../../context/contracts';
import AccountBalance from '../my-account/AccountBalance';

interface State {
  modalIsOpen: boolean;
}

const MyAccount: React.FC<HTMLAttributes<HTMLDivElement>> = props => {
  const {marketsData} = useContext(ContractsContext);

  return <AccountBalance marketsData={marketsData} />;
};

export default MyAccount;
