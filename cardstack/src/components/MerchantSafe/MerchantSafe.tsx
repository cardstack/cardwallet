import React, { useCallback } from 'react';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import {
  Container,
  Icon,
  SafeHeader,
  Text,
  Touchable,
} from '@cardstack/components';
import { MerchantInformation, MerchantSafeType } from '@cardstack/types';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { useMerchantInfoDID } from '@cardstack/components/TransactionConfirmationSheet/displays/Merchant/hooks';

interface MerchantSafeProps extends MerchantSafeType {
  networkName: string;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  merchantInfo?: MerchantInformation;
  infoDID: string;
}

export const MerchantSafe = (props: MerchantSafeProps) => {
  const { navigate } = useNavigation();

  const { merchantInfoDID } = useMerchantInfoDID(props.infoDID);

  const onPress = useCallback(() => {
    const merchantData = { ...props, merchantInfo: merchantInfoDID };
    navigate(Routes.MERCHANT_SCREEN, { merchantSafe: merchantData });
  }, [merchantInfoDID, navigate, props]);

  return (
    <Container paddingHorizontal={4} marginBottom={4}>
      <Touchable testID="inventory-card" onPress={onPress}>
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
        >
          <SafeHeader {...props} onPress={onPress} />
          <Container paddingHorizontal={6}>
            <MerchantInfo
              color={merchantInfoDID?.color}
              textColor={merchantInfoDID?.textColor}
              name={merchantInfoDID?.name}
            />
            <Bottom slug={merchantInfoDID?.slug} />
          </Container>
        </Container>
      </Touchable>
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
        <Icon name="user" />
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
        <Text variant="subText">Merchant Account</Text>
      </Container>
    </Container>
  );
};

const Bottom = ({ slug }: { slug?: string }) => {
  return (
    <Container paddingBottom={6}>
      <Container flexDirection="row" justifyContent="space-between">
        <Container>
          <Text fontWeight="400" fontSize={11}>
            Merchant ID
          </Text>
          <Text fontWeight="bold" fontSize={13}>
            {slug}
          </Text>
        </Container>
        <Container flexDirection="row" alignItems="center">
          <Container flexDirection="row" marginRight={3}>
            <Text fontWeight="bold" fontSize={13}>
              1{' '}
            </Text>
            <Text fontWeight="400" fontSize={13}>
              manager
            </Text>
          </Container>
          <Icon name="user" />
        </Container>
      </Container>
    </Container>
  );
};
