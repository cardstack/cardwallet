import { times } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { Centered, Column } from '../layout';
import AssetListHeader from './AssetListHeader';
import AssetListItemSkeleton from './AssetListItemSkeleton';
import { Text } from '@cardstack/components';
import { position } from '@rainbow-me/styles';

const Container = styled(Column)`
  ${position.size('100%')};
`;

const EmptyAssetList = ({
  descendingOpacity,
  isWalletEthZero,
  skeletonCount = 5,
  title,
  ...props
}) => (
  <Container {...props}>
    <Centered flex={1}>
      {isWalletEthZero ? (
        <Text>Empty Wallet</Text>
      ) : (
        <React.Fragment>
          {title && <AssetListHeader title={title} />}
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
      )}
    </Centered>
  </Container>
);

export default EmptyAssetList;
