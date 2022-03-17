import React, { useCallback } from 'react';
import { strings } from './strings';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import {
  CardPressable,
  Container,
  Icon,
  SafeHeader,
  Text,
} from '@cardstack/components';
import { MerchantInformation, MerchantSafeType } from '@cardstack/types';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

export interface MerchantSafeProps extends MerchantSafeType {
  merchantInfo?: MerchantInformation;
  disabled?: boolean;
  headerRightText?: string;
}

export const MerchantSafe = ({
  merchantInfo,
  disabled = false,
  headerRightText,
  ...props
}: MerchantSafeProps) => {
  const { navigate } = useNavigation();
  const { primarySafe } = usePrimarySafe();

  const onPress = useCallback(() => {
    const merchantData = { ...props, merchantInfo };
    navigate(Routes.MERCHANT_SCREEN, { merchantSafe: merchantData });
  }, [merchantInfo, navigate, props]);

  return (
    <Container paddingHorizontal={4} marginBottom={4} width="100%">
      <CardPressable
        backgroundColor="white"
        borderRadius={10}
        overflow="hidden"
        borderColor="buttonPrimaryBorder"
        testID="inventory-card"
        onPress={onPress}
        disabled={disabled}
      >
        <SafeHeader
          {...props}
          small
          onPress={onPress}
          backgroundColor={merchantInfo?.color}
          textColor={merchantInfo?.textColor}
          rightText={headerRightText}
          disabled={disabled}
        />
        <Container paddingHorizontal={5}>
          <MerchantInfo
            color={merchantInfo?.color}
            textColor={merchantInfo?.textColor}
            name={merchantInfo?.name}
          />
          <Bottom
            isPrimary={primarySafe?.address === props?.address}
            slug={merchantInfo?.slug}
          />
        </Container>
      </CardPressable>
    </Container>
  );
};

export const MerchantInfo = ({
  textColor,
  name,
  color,
}: {
  textColor?: string;
  name?: string;
  color?: string;
}) => {
  return (
    <Container
      flexDirection="row"
      paddingVertical={10}
      alignItems="center"
      justifyContent="flex-start"
    >
      {name ? (
        <ContactAvatar
          color={color}
          size="xlarge"
          value={name}
          textColor={textColor}
        />
      ) : (
        <Icon name="user-with-background" size={80} />
      )}

      <Container flex={1}>
        <Text
          testID="merchant-name"
          weight="bold"
          paddingHorizontal={3}
          ellipsizeMode="tail"
          numberOfLines={2}
          fontSize={20}
        >
          {name || ''}
        </Text>
      </Container>
    </Container>
  );
};

const Bottom = ({
  slug,
  isPrimary = false,
}: {
  slug?: string;
  isPrimary?: boolean;
}) => {
  return (
    <Container
      paddingBottom={4}
      flexDirection="row"
      justifyContent="space-between"
    >
      <Text testID="merchant-slug" weight="bold" fontSize={13}>
        ID: {slug}
      </Text>
      {isPrimary && (
        <Text weight="bold" fontSize={13}>
          {strings.primaryProfile}
        </Text>
      )}
    </Container>
  );
};
