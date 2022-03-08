import React, { useCallback } from 'react';
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
  notPressable?: boolean;
}

export const MerchantSafe = ({
  merchantInfo,
  notPressable = false,
  ...props
}: MerchantSafeProps) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    const merchantData = { ...props, merchantInfo };
    navigate(Routes.MERCHANT_SCREEN, { merchantSafe: merchantData });
  }, [merchantInfo, navigate, props]);

  const PressableComponent = notPressable ? Container : CardPressable;

  return (
    <Container paddingHorizontal={4} marginBottom={4} width="100%">
      <PressableComponent
        backgroundColor="white"
        borderRadius={10}
        overflow="hidden"
        borderColor="buttonPrimaryBorder"
        testID="inventory-card"
        onPress={notPressable ? undefined : onPress}
      >
        <SafeHeader
          {...props}
          onPress={onPress}
          backgroundColor={merchantInfo?.color}
          textColor={merchantInfo?.textColor}
          rightText={notPressable ? 'Profile' : undefined}
        />
        <Container paddingHorizontal={6}>
          <MerchantInfo
            color={merchantInfo?.color}
            textColor={merchantInfo?.textColor}
            name={merchantInfo?.name}
          />
          <Bottom slug={merchantInfo?.slug} />
        </Container>
      </PressableComponent>
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
    <Container flexDirection="column" paddingVertical={8} alignItems="center">
      {name ? (
        <Container marginBottom={4}>
          <ContactAvatar
            color={color}
            size="xlarge"
            value={name}
            textColor={textColor}
          />
        </Container>
      ) : (
        <Icon name="user-with-background" size={80} />
      )}

      <Container
        flexDirection="column"
        justifyContent="center"
        width="85%"
        alignItems="center"
      >
        <Text
          weight="bold"
          ellipsizeMode="tail"
          numberOfLines={1}
          fontSize={20}
        >
          {name || ''}
        </Text>
      </Container>
    </Container>
  );
};

const Bottom = ({ slug }: { slug?: string }) => {
  return (
    <Container paddingBottom={6}>
      <Container flexDirection="row" justifyContent="space-between">
        <Container>
          <Text weight="regular" fontSize={11}>
            Account ID
          </Text>
          <Text weight="bold" fontSize={13}>
            {slug}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};
