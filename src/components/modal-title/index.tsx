import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

import CloseModal from '../common/img/CloseModal';

import {themeColors} from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  closeButtonDisabled?: boolean;
  onRequestClose: any;
  title: string;
}

const ModalTitleWrapper = styled.div`
  align-items: flex-start;
  border-bottom: 1px solid ${themeColors.borderColor};
  display: flex;
  justify-content: space-between;
  margin: 0 0 25px;
  padding: 0 0 10px 0;
`;

const ModalTitleText = styled.h2`
  color: #222;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  padding: 0 15px 0 0;
`;

const ModalClose = styled.button`
  align-items: flex-start;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  height: 21px;
  justify-content: flex-end;
  outline: none;
  padding: 0;
  width: 30px;

  &:active {
    opacity: 0.8;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

class ModalTitle extends React.Component<Props> {
  public render = () => {
    const {onRequestClose, title, closeButtonDisabled, ...restProps} = this.props;

    return (
      <ModalTitleWrapper {...restProps}>
        <ModalTitleText>{title}</ModalTitleText>
        <ModalClose onClick={onRequestClose} disabled={closeButtonDisabled}>
          <CloseModal />
        </ModalClose>
      </ModalTitleWrapper>
    );
  };
}

export default ModalTitle;
