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

const SELECT_ICON_WIDTH = '13%';
const EDITING_COIN_ROW_WIDTH = '87%';

export interface MerchantSafeProps extends MerchantSafeType {
  networkName: string;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  merchantInfo?: MerchantInformation;
  infoDID: string;
  isSelected?: boolean;
  setSelected?: () => void;
}

export const MerchantSafe = ({
  merchantInfo,
  isSelected = false,
  setSelected,
  ...props
}: MerchantSafeProps) => {
  const { navigate } = useNavigation();

  const selectedIconName = isSelected ? 'check-circle' : 'circle';

  const onPress = useCallback(() => {
    if (setSelected) {
      setSelected();
    } else {
      const merchantData = { ...props, merchantInfo };
      navigate(Routes.MERCHANT_SCREEN, { merchantSafe: merchantData });
    }
  }, [merchantInfo, setSelected, navigate, props]);

  return (
    <Container paddingHorizontal={4} marginBottom={4}>
      <CardPressable
        overflow="hidden"
        flexDirection="row"
        alignItems="center"
        borderColor="buttonPrimaryBorder"
        testID="inventory-card"
        onPress={onPress}
      >
        {!!setSelected && (
          <>
            <Container width={SELECT_ICON_WIDTH}>
              <Icon
                name={selectedIconName}
                iconSize="medium"
                iconFamily="MaterialCommunity"
                color={isSelected ? 'teal' : null}
              />
            </Container>
          </>
        )}
        <Container
          overflow="hidden"
          backgroundColor="white"
          borderRadius={20}
          width={setSelected ? EDITING_COIN_ROW_WIDTH : '100%'}
        >
          <SafeHeader
            {...props}
            backgroundColor={merchantInfo?.color}
            textColor={merchantInfo?.textColor}
            onPress={setSelected ? undefined : onPress}
          />
          <Container paddingHorizontal={6}>
            <MerchantInfo
              color={merchantInfo?.color}
              textColor={merchantInfo?.textColor}
              name={merchantInfo?.name}
            />
            <Bottom slug={merchantInfo?.slug} />
          </Container>
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
        <Text variant="subText">Business Account</Text>
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
        <Container flexDirection="row" alignItems="center">
          <Container flexDirection="row" marginRight={3}>
            <Text weight="bold" fontSize={13}>
              1{' '}
            </Text>
            <Text weight="regular" fontSize={13}>
              manager
            </Text>
          </Container>
          <Icon name="user-with-background" />
        </Container>
      </Container>
    </Container>
  );
};
