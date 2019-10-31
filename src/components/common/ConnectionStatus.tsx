import React, {HTMLAttributes} from 'react';
import {Text} from 'rebass';
import {shortenAccount} from '../../util/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  account: string;
}

const ConnectionStatus: React.FC<Props> = ({account}) => {
  const shortenedAccount = shortenAccount(account);

  return <Text fontWeight={600}>{shortenedAccount}</Text>;
};

export default ConnectionStatus;
