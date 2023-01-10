import { times } from 'lodash';
import React from 'react';
import styled from 'styled-components';

import { position } from '@rainbow-me/styles';

import { Centered, Column } from '../layout';

import AssetListItemSkeleton from './AssetListItemSkeleton';

const Container = styled(Column)`
  ${position.size('100%')};
`;

const EmptyAssetList = ({
  descendingOpacity,
  isWalletEthZero,
  skeletonCount = 5,
  ...props
}) => (
  <Container {...props}>
    <Centered flex={1}>
      <React.Fragment>
        <Column cover>
          {times(skeletonCount, index => (
            <AssetListItemSkeleton
              animated={!isWalletEthZero}
              descendingOpacity={descendingOpacity || isWalletEthZero}
              index={index}
              key={`skeleton${index}`}
            />
          ))}
        </Column>
      </React.Fragment>
    </Centered>
  </Container>
);

export default EmptyAssetList;
