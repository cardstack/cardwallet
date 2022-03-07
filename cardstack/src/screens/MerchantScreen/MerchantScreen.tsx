import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { StatusBar } from 'react-native';
import {
  CenteredContainer,
  Container,
  Icon,
  NetworkBadge,
  Text,
  Touchable,
  MerchantContent,
  MerchantContentProps,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { useAccountSettings } from '@rainbow-me/hooks';
import { useGetSafesDataQuery } from '@cardstack/services';
import { RouteType } from '@cardstack/navigation/types';

const MerchantScreen = () => {
  const {
    params: { merchantSafe: merchantSafeFallback },
  } = useRoute<RouteType<MerchantContentProps>>();

  const { accountAddress, nativeCurrency } = useAccountSettings();

  const { updatedMerchantSafe, isRefreshingBalances } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      selectFromResult: ({ data, isFetching }) => ({
        updatedMerchantSafe: data?.merchantSafes.find(
          (safe: MerchantSafeType) =>
            safe.address === merchantSafeFallback.address
        ),
        isRefreshingBalances: isFetching,
      }),
    }
  );

  const merchantSafe = updatedMerchantSafe || merchantSafeFallback;

  return (
    <Container top={0} width="100%" backgroundColor="white">
      <StatusBar barStyle="light-content" />
      <Header
        address={merchantSafe.address}
        name={merchantSafe.merchantInfo?.name}
      />
      <MerchantContent
        merchantSafe={merchantSafe}
        isRefreshingBalances={isRefreshingBalances}
      />
    </Container>
  );
};

export default memo(MerchantScreen);

const Header = ({ address, name }: { address: string; name?: string }) => {
  const { goBack, navigate } = useNavigation();

  const onPressInformation = useCallback(() => {
    navigate(Routes.MODAL_SCREEN, {
      address,
      type: 'copy_address',
    });
  }, [address, navigate]);

  return (
    <Container paddingTop={14} backgroundColor="black">
      <Container paddingBottom={6}>
        <CenteredContainer flexDirection="row">
          <Touchable onPress={goBack} left={12} position="absolute">
            <Icon name="chevron-left" color="teal" size={30} />
          </Touchable>
          <Container alignItems="center" width="80%">
            <Text
              color="white"
              weight="bold"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {name || ''}
            </Text>
            <Container flexDirection="row" alignItems="center">
              <NetworkBadge marginRight={2} />
              <Touchable onPress={onPressInformation}>
                <Container flexDirection="row" alignItems="center">
                  <Text
                    fontFamily="RobotoMono-Regular"
                    color="white"
                    size="xs"
                    marginRight={2}
                  >
                    {getAddressPreview(address)}
                  </Text>
                  <Icon name="info" size={15} />
                </Container>
              </Touchable>
            </Container>
          </Container>
        </CenteredContainer>
      </Container>
    </Container>
  );
};
