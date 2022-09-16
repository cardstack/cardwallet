import React, { memo, useCallback } from 'react';
import { Linking, Share } from 'react-native';
import URL from 'url-parse';

import {
  AnimatedPressable,
  Container,
  Icon,
  Text,
} from '@cardstack/components';
import { CollectibleType } from '@cardstack/types';

import { buildCollectibleName } from '@rainbow-me/helpers/assets';
import NetworkTypes from '@rainbow-me/networkTypes';
import { showActionSheetWithOptions } from '@rainbow-me/utils';
import logger from 'logger';

function viewMenuItemLabel(collectible: CollectibleType) {
  if (collectible.networkName === NetworkTypes.mainnet) {
    return 'View on OpenSea';
  }

  try {
    if (collectible.permalink) {
      return `View on ${tldFromUrlString(collectible.permalink)}`;
    }
  } catch (e) {
    logger.log('viewMenuItemLabel', e.message);
    // do nothing
  }

  return 'View on the web';
}

interface CollectibleHeaderProps {
  collectible: CollectibleType;
}

const CollectibleHeader = ({ collectible }: CollectibleHeaderProps) => {
  const onContextMenuPress = useCallback(() => {
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
  }, [collectible]);

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
              color="blueDarkest"
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
          <AnimatedPressable onPress={onContextMenuPress}>
            <Icon color="backgroundBlue" name="more-circle" />
          </AnimatedPressable>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(CollectibleHeader);

function tldFromUrlString(urlString: string) {
  const url = new URL(urlString);
  return url.host.split('.').slice(-2).join('.');
}
