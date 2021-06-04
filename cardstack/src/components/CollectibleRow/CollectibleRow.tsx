import React from 'react';
import { UniqueTokenImage } from '../../../../src/components/unique-token';
import { CollectibleType } from '@cardstack/types';
import { Touchable, Container, Text } from '@cardstack/components';
import { useWallets } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { buildUniqueTokenName } from '@rainbow-me/helpers/assets';

export const CollectibleRow = (collectible: CollectibleType) => {
  const { isReadOnlyWallet } = useWallets();
  const { navigate } = useNavigation();

  const onPress = () => {
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: collectible,
      isReadOnlyWallet,
      type: 'unique_token',
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
          <UniqueTokenImage
            imageUrl={collectible.image_preview_url}
            item={collectible}
          />
        </Container>
        <Container flex={1} flexDirection="column">
          <Text numberOfLines={3} weight="extraBold">
            {buildUniqueTokenName(collectible)}
          </Text>
          <Text variant="subText">{collectible.asset_contract?.name}</Text>
        </Container>
      </Container>
    </Touchable>
  );
};
