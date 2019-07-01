import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

import {themeBreakPoints} from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ContentCenterWrapper = styled.div`
  margin: 0 auto;
  max-width: ${themeBreakPoints.xxl};
  width: 100%;
`;

const ContentCenter: React.FC<Props> = (props: Props) => {
  const {children, ...restProps} = props;

  return <ContentCenterWrapper {...restProps}>{children}</ContentCenterWrapper>;
};

export default ContentCenter;
