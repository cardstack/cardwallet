import {
  getConstantByNetwork,
  supportedChainsArray,
} from '@cardstack/cardpay-sdk';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAccountSettings } from '../../../hooks';
import { settingsUpdateNetwork } from '../../../redux/settings';
import { Container, FloatingTag, RadioItemProps } from '@cardstack/components';
import { NetworkType } from '@cardstack/types';
import { CARDPAY_SUPPORTED_NETWORKS, isMainnet } from '@cardstack/utils';

export const useNetworkSection = () => {
  const { network } = useAccountSettings();
  const dispatch = useDispatch();
  const [selectedNetwork, setSelectedNetwork] = useState(network);
  const [isShowAllNetworks, setShowAllNetworks] = useState<boolean>(false);

  const networkTags = useCallback(
    ({ isTestnet, hasCardPay }) => (
      <Container
        alignItems="center"
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        marginLeft={4}
      >
        {hasCardPay && (
          <FloatingTag
            copy="CardPay"
            theme={{ color: 'black', backgroundColor: 'teal' }}
          />
        )}
        {isTestnet && (
          <FloatingTag
            copy="testnet"
            theme={{ color: 'black', backgroundColor: 'orange' }}
          />
        )}
      </Container>
    ),
    []
  );

  // transform data for sectionList
  const sectionListItems: RadioItemProps[] = useMemo(() => {
    const data = supportedChainsArray
      .map((network, index) => ({
        key: index,
        index: index,
        label: getConstantByNetwork('name', network),
        value: network.toLowerCase(),
        selected: selectedNetwork === network,
        disabled: false,
        hasTags: networkTags({
          isTestnet: !isMainnet(network as NetworkType),
          hasCardPay: CARDPAY_SUPPORTED_NETWORKS.includes(
            network as NetworkType
          ),
        }),
      }))
      .filter(network =>
        !isShowAllNetworks ? isMainnet(network.value as NetworkType) : network
      );

    return [{ data }];
  }, [selectedNetwork, isShowAllNetworks, networkTags]);

  const onNetworkChange = useCallback(
    async selected => {
      if (selected) {
        setSelectedNetwork(selected);
      }
    },
    [setSelectedNetwork]
  );

  const onUpdateNetwork = useCallback(() => {
    dispatch(settingsUpdateNetwork(selectedNetwork));
  }, [dispatch, selectedNetwork]);

  const onToggleShowAllNetworks = useCallback(
    () => setShowAllNetworks(isShowAll => !isShowAll),
    []
  );

  const isCurrentNetworkSelected = useMemo(() => selectedNetwork === network, [
    network,
    selectedNetwork,
  ]);

  return {
    isCurrentNetworkSelected,
    isShowAllNetworks,
    sectionListItems,
    onNetworkChange,
    onUpdateNetwork,
    onToggleShowAllNetworks,
  };
};
