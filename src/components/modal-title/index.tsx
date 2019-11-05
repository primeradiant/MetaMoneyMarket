import React, {HTMLAttributes} from 'react';
import {Box, Button, Flex, Text} from 'rebass';

import CloseModal from '../common/img/CloseModal';

interface Props extends HTMLAttributes<HTMLDivElement> {
  closeButtonDisabled?: boolean;
  onRequestClose: any;
  title: string;
}

const ModalTitle: React.FC<Props> = ({closeButtonDisabled, onRequestClose, title, ...rest}) => (
  <>
    <Flex variant="card-inner-small" alignItems="center" {...rest}>
      <Text flex={1} variant="modal-title">
        {title}
      </Text>
      <Button
        onClick={onRequestClose}
        disabled={closeButtonDisabled}
        sx={{
          color: '#999',
          display: 'flex',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          '&[disabled]': {cursor: 'not-allowed'},
        }}
      >
        <CloseModal />
      </Button>
    </Flex>
    <Box variant="divider" />
  </>
);

export default ModalTitle;
