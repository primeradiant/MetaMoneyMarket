import React, {HTMLAttributes} from 'react';
import styled, {keyframes} from 'styled-components';

import LoadingIcon from './img/LoadingIcon';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const LoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingAnimate = styled.div`
  animation: ${rotate} 1.5s linear infinite;
`;

const Loading: React.FC = (props: Props) => {
  const {...restProps} = props;

  return (
    <LoadingWrapper {...restProps}>
      <LoadingAnimate>
        <LoadingIcon />
      </LoadingAnimate>
    </LoadingWrapper>
  );
};

export default Loading;
