import React from 'react';
import {Box, BoxProps} from 'rebass';

export const RebassTr: React.FC<BoxProps> = props => <Box as="tr" variant="tr" {...props} />;
export const RebassTd: React.FC<BoxProps> = props => <Box as="td" variant="td" {...props} />;
export const RebassTh: React.FC<BoxProps> = props => <Box as="th" variant="th" {...props} />;
export const RebassThead: React.FC<BoxProps> = props => <Box as="thead" variant="thead" {...props} />;
export const RebassTbody: React.FC<BoxProps> = props => <Box as="tbody" variant="tbody" {...props} />;
export const RebassTable: React.FC<BoxProps> = props => <Box as="table" variant="table" {...props} />;
