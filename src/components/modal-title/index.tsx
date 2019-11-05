import React, {HTMLAttributes} from 'react';
import {Box, Button, Flex, Text} from 'rebass';

const CloseModal = () => (
  <svg stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" width={20} height={20}>
    <path d="M6.343 6.343l11.314 11.314m-11.314 0L17.657 6.343" />
  </svg>
);

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
