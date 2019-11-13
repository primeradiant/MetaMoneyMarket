import React, {HTMLAttributes, useContext} from 'react';
import {ContractsContext} from '../../context/contracts';
import AccountBalance from '../my-account/AccountBalance';
import Wrapper from '../ui/Wrapper';

interface State {
  modalIsOpen: boolean;
}

const MyAccount: React.FC<HTMLAttributes<HTMLDivElement>> = props => {
  const {marketsData} = useContext(ContractsContext);

  return (
    <Wrapper>
      <AccountBalance marketsData={marketsData} />
    </Wrapper>
  );
};

export default MyAccount;
