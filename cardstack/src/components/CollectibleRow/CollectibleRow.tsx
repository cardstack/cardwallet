import React from 'react';
import { CollectibleImage } from '../../../../src/components/collectible';
import { CollectibleType } from '@cardstack/types';
import { Touchable, Container, Text } from '@cardstack/components';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { buildCollectibleName } from '@rainbow-me/helpers/assets';

export const CollectibleRow = (collectible: CollectibleType) => {
  const { navigate } = useNavigation();

  const onPress = () => {
    console.log('::: collectible', collectible);
    navigate(Routes.COLLECTIBLE_SHEET, {
      collectible,
    });
  };

  return (
    <Touchable onPress={onPress} marginHorizontal={5} marginVertical={2}>
      <Container
        alignItems="center"
        backgroundColor="white"
        borderRadius={10}
        padding={4}
        width="100%"
        flexDirection="row"
      >
        <Container
          width={130}
          height={130}
          borderRadius={10}
          overflow="hidden"
          marginRight={4}
        >
          <CollectibleImage
            imageUrl={collectible.image_preview_url}
            item={collectible}
          />
        </Container>
        <Container flex={1} flexDirection="column">
          <Text numberOfLines={3} weight="extraBold">
            {buildCollectibleName(collectible)}
          </Text>
          <Text variant="subText">{collectible.asset_contract?.name}</Text>
        </Container>
      </Container>
    </Touchable>
  );
};
