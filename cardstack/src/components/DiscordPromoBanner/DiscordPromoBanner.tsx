import React from 'react';

import promoBanner from '../../assets/promo.png';
import { Image, Touchable } from '@cardstack/components';
import { screenWidth } from '@cardstack/utils';

const layouts = {
  maxWidth: screenWidth * 0.92, // magic number but it works good on big and smaller devices
};

export const DiscordPromoBanner = ({ onPress }: { onPress: () => void }) => (
  <Touchable onPress={onPress}>
    <Image
      alignSelf="center"
      borderRadius={10}
      marginVertical={4}
      maxWidth={layouts.maxWidth}
      overflow="hidden"
      source={promoBanner}
    />
  </Touchable>
);
