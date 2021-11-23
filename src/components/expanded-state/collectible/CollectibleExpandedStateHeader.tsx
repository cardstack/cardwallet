import React, { memo } from 'react';
import { Linking, Share } from 'react-native';

import { buildCollectibleName } from '../../../helpers/assets';
import { showActionSheetWithOptions } from '../../../utils';
import ButtonPressAnimation from '../../animations/ButtonPressAnimation';
import { Container, Icon, Text } from '@cardstack/components';
import { CollectibleType } from '@cardstack/types';
import NetworkTypes from '@rainbow-me/networkTypes';

function viewMenuItemLabel(collectible: CollectibleType) {
  if (collectible.networkName === NetworkTypes.mainnet) {
    return 'View on OpenSea';
  }

  if (collectible.asset_contract.name.toUpperCase() === 'POAP') {
    return 'View on POAP';
  }

  return 'View on the web';
}

interface CollectibleExpandedStateHeaderProps {
  collectible: CollectibleType;
}

const CollectibleExpandedStateHeader = ({
  collectible,
}: CollectibleExpandedStateHeaderProps) => {
  const onContextMenuPress = () => {
    showActionSheetWithOptions(
      {
        options: ['Share', viewMenuItemLabel(collectible), 'Cancel'],
        cancelButtonIndex: 2,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          Share.share({
            title: `Share ${buildCollectibleName(collectible)} Info`,
            url: collectible.permalink,
          });
        } else if (buttonIndex === 1) {
          // View
          Linking.openURL(collectible.permalink);
        }
      }
    );
  };

  return (
    <Container
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
      marginBottom={4}
      marginTop={12}
      paddingHorizontal={5}
    >
      <Container
        alignItems="flex-start"
        flex={1}
        flexShrink={1}
        justifyContent="flex-start"
      >
        <Container>
          <Container
            backgroundColor="backgroundLightGray"
            borderRadius={50}
            marginBottom={2}
            maxWidth={150}
            paddingHorizontal={2}
            style={{ paddingVertical: 1 }}
          >
            <Text
              color="networkBadge"
              fontSize={9}
              numberOfLines={1}
              weight="bold"
            >
              #{collectible.id}
            </Text>
          </Container>
          <Text color="blueText" size="small" weight="extraBold">
            {collectible.asset_contract.name.toUpperCase()}
          </Text>
        </Container>
        <Container
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Container width="80%">
            <Text size="medium" weight="extraBold">
              {buildCollectibleName(collectible)}
            </Text>
          </Container>
          <ButtonPressAnimation onPress={onContextMenuPress}>
            <Icon color="backgroundBlue" name="more-circle" />
          </ButtonPressAnimation>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(CollectibleExpandedStateHeader);
