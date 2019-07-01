import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TermsContainer = styled.div``;

const TermsAndConditions: React.FC<Props> = (props: Props) => {
  const {...restProps} = props;

  return <TermsContainer {...restProps}>Tems and conditions</TermsContainer>;
};

export default TermsAndConditions;
