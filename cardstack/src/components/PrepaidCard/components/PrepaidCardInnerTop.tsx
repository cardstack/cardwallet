import React, { memo, useCallback } from 'react';

import { Touchable } from '../../Touchable';
import { PrepaidCardProps } from '../PrepaidCard';
import Routes from '@rainbow-me/routes';
import { useNavigation } from '@rainbow-me/navigation';
import { getAddressPreview } from '@cardstack/utils';
import { ColorTypes } from '@cardstack/theme';
import { Container, Text } from '@cardstack/components';
import { hitSlop } from '@cardstack/utils/layouts';

type CardVariants = 'normal' | 'medium';

export type PrepaidCardInnerTopProps = Pick<
  PrepaidCardProps,
  'address' | 'networkName' | 'cardCustomization'
> & { variant?: CardVariants; disabled?: boolean };

interface VariantType {
  fontSize: { small: number; mid: number; big: number };
  maxWidth: number;
}

const cardType: Record<CardVariants, VariantType> = {
  normal: {
    fontSize: { small: 11, mid: 13, big: 18 },
    maxWidth: 150,
  },
  medium: {
    fontSize: { small: 8, mid: 10, big: 11 },
    maxWidth: 100,
  },
};

const PrepaidCardInnerTop = ({
  address,
  networkName,
  cardCustomization,
  variant = 'normal',
  disabled = false,
}: PrepaidCardInnerTopProps) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    navigate(Routes.MODAL_SCREEN, {
      address,
      disableCopying: true,
      type: 'copy_address',
    });
  }, [address, navigate]);

  return (
    <Container width="100%" paddingHorizontal={6} paddingVertical={4}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          variant="overGradient"
          fontSize={cardType[variant].fontSize.small}
          color={cardCustomization?.textColor as ColorTypes}
          style={{ textShadowColor: cardCustomization?.patternColor }}
          textShadowColor={cardCustomization?.patternColor as ColorTypes}
        >
          Issued by
        </Text>
        <Text
          variant="overGradient"
          fontSize={cardType[variant].fontSize.mid}
          weight="bold"
          letterSpacing={0.33}
          color={cardCustomization?.textColor as ColorTypes}
          style={{ textShadowColor: cardCustomization?.patternColor }}
          textShadowColor={cardCustomization?.patternColor as ColorTypes}
        >
          PREPAID CARD
        </Text>
      </Container>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Container maxWidth={cardType[variant].maxWidth}>
          <Text
            variant="overGradient"
            fontSize={cardType[variant].fontSize.mid}
            weight="extraBold"
            color={cardCustomization?.textColor as ColorTypes}
            textShadowColor={cardCustomization?.patternColor as ColorTypes}
            numberOfLines={1}
          >
            {cardCustomization?.issuerName || 'Unknown'}
          </Text>
        </Container>
        <Container flexDirection="column" paddingTop={3}>
          <Touchable
            hitSlop={hitSlop.small}
            disabled={disabled}
            onPress={onPress}
          >
            <Text
              variant="overGradient"
              fontFamily="RobotoMono-Regular"
              fontSize={cardType[variant].fontSize.big}
              color={cardCustomization?.textColor as ColorTypes}
              textShadowColor={cardCustomization?.patternColor as ColorTypes}
            >
              {getAddressPreview(address)}
            </Text>
          </Touchable>
          <Text
            fontSize={cardType[variant].fontSize.small}
            color={cardCustomization?.textColor as ColorTypes}
            textShadowColor={cardCustomization?.patternColor as ColorTypes}
            textAlign="right"
          >{`ON ${networkName.toUpperCase()}`}</Text>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(PrepaidCardInnerTop);
