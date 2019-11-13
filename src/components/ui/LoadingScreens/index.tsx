import React from 'react';
import Skeleton from 'react-loading-skeleton';
import {Box, Flex, Text} from 'rebass';

const hideOnTabletAndBelow = {
  display: ['none', null, 'block'],
};

export const SkeletonAsset: React.FC = () => (
  <Box variant="asset-row">
    <Flex variant="asset-grid-row">
      <Box variant="asset-grid-col">
        <Flex alignItems="center">
          <Box mr={[2, 3]} height={24} width={24}>
            <Text lineHeight={1}>
              <Skeleton circle={true} height={24} width={24} />
            </Text>
          </Box>
          <Skeleton width={48} />
        </Flex>
      </Box>
      <Box variant="asset-grid-col" sx={hideOnTabletAndBelow}>
        <Text variant="body" textAlign="right">
          <Skeleton width={48} />
        </Text>
      </Box>
      <Box variant="asset-grid-col">
        <Text variant="body" textAlign="right">
          <Skeleton width={48} />
        </Text>
      </Box>
      <Box variant="asset-grid-col">
        <Text variant="body" textAlign="right">
          <Skeleton width={64} />
        </Text>
      </Box>
      <Box variant="asset-grid-col" flex={1.2} sx={hideOnTabletAndBelow}>
        <Flex justifyContent="flex-end" flex={1} px={1}>
          <Skeleton width={100} />
        </Flex>
      </Box>
    </Flex>
  </Box>
);

export const SkeletonAssets: React.FC = () => (
  <>
    {Array(3)
      .fill(' ')
      .map((el, index) => (
        <SkeletonAsset key={index} />
      ))}
  </>
);
