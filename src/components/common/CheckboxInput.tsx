import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

import CheckboxOff from './img/CheckboxOff';
import CheckboxOn from './img/CheckboxOn';

interface OwnProps {
  checked?: boolean;
}

interface Props extends HTMLAttributes<HTMLDivElement>, OwnProps {}

const CheckboxWrapper = styled.div`
  cursor: pointer;
  position: relative;

  > input {
    cursor: pointer;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 5;
  }

  > svg {
    display: block;
    left: 0;
    position: relative;
    z-index: 1;
  }
`;

const CheckboxInput: React.FC<Props> = (props: Props) => {
  const {checked, ...restProps} = props;

  return (
    <CheckboxWrapper {...restProps}>
      {checked ? <CheckboxOn /> : <CheckboxOff />}
      <input type="radio" defaultChecked={checked} />
    </CheckboxWrapper>
  );
};

export default CheckboxInput;
