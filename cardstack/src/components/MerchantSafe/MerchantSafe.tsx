import React from 'react';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import {
  CenteredContainer,
  Container,
  Icon,
  SafeHeader,
  Text,
  Touchable,
} from '@cardstack/components';
import { MerchantInformation, MerchantSafeType } from '@cardstack/types';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import {
  PinnedHiddenSectionOption,
  useHiddenItemOptions,
} from '@rainbow-me/hooks';

interface MerchantSafeProps extends MerchantSafeType {
  networkName: string;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  merchantInfo?: MerchantInformation;
  infoDID: string;
}

const SELECT_ICON_WIDTH = '13%';

export const MerchantSafe = ({ merchantInfo, ...props }: MerchantSafeProps) => {
  const { navigate } = useNavigation();

  const { editing, selected, hidden, handleSelection } = useHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.BUSINESS_ACCOUNTS;
  const isHidden = hidden.includes(props.address);

  if (!isEditing && isHidden) {
    return null;
  }

  const isSelected = selected.includes(props.address);
  const showIcon = isHidden;
  const iconName = 'eye-off';
  const iconFamily = isHidden ? 'Feather' : 'MaterialCommunity';
  const editingIconName = isSelected ? 'check-circle' : 'circle';

  const onPress = () => {
    if (isEditing) {
      handleSelection(isEditing, isSelected, props.address);

      return;
    }

    const merchantData = { ...props, merchantInfo };
    navigate(Routes.MERCHANT_SCREEN, { merchantSafe: merchantData });
  };

  return (
    <Touchable
      width="100%"
      testID="business-accounts"
      alignItems="center"
      flexDirection="row"
      onPress={onPress}
    >
      {isEditing && (
        <Container
          testID={`coin-row-editing-icon-${editingIconName}`}
          padding={2}
          width={SELECT_ICON_WIDTH}
        >
          <Icon
            name={editingIconName}
            iconSize="medium"
            iconFamily={iconFamily}
            color={isSelected ? 'teal' : null}
          />
        </Container>
      )}
      {isEditing && showIcon && (
        <Container
          height="100%"
          justifyContent="center"
          left="9%"
          position="absolute"
          width={50}
          zIndex={5}
          testID={`coin-row-icon-${iconName}`}
        >
          <CenteredContainer
            width={28}
            height={28}
            borderRadius={100}
            backgroundColor="black"
          >
            <Icon
              size={16}
              color="teal"
              name={iconName}
              iconFamily={iconFamily}
            />
          </CenteredContainer>
        </Container>
      )}
      <Container
        paddingHorizontal={4}
        marginBottom={4}
        width={isEditing ? '87%' : '100%'}
      >
        <Touchable testID="inventory-card" onPress={onPress}>
          <Container
            backgroundColor="white"
            borderRadius={10}
            overflow="hidden"
            borderColor="buttonPrimaryBorder"
          >
            <SafeHeader
              {...props}
              onPress={onPress}
              backgroundColor={merchantInfo?.color}
              textColor={merchantInfo?.textColor}
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
        </Touchable>
      </Container>
      {isEditing && isHidden && (
        <Container
          backgroundColor="black"
          top={0}
          bottom={0}
          right={16}
          borderRadius={10}
          opacity={0.5}
          position="absolute"
          height="95.4%"
          width="79%"
          zIndex={1}
          testID="coin-row-hidden-overlay"
        />
      )}
    </Touchable>
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
        <Icon name="user" size={80} />
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
          <Text fontWeight="400" fontSize={11}>
            Account ID
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
