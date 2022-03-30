import { toLower, values } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import networkInfo from '../../../helpers/networkInfo';
import { useAccountSettings } from '../../../hooks';
import {
  INITIAL_STATE,
  settingsUpdateNetwork,
  toggleShowTestnets,
} from '../../../redux/settings';
import { RadioItemProps } from '@cardstack/components';

const networks = values(networkInfo);
const defaultNetwork = INITIAL_STATE.network;

export const useNetworkSection = () => {
  const { network, showTestnets } = useAccountSettings();
  const [selectedNetwork, setSelectedNetwork] = useState(network);
  const dispatch = useDispatch();
  const networkSelected = useMemo(() => networkInfo[network], [network]);

  // transform data for sectionList
  const sectionListItems = useMemo(() => {
    const filteredNetworks = networks.filter(item =>
      showTestnets ? true : !item.isTestnet
    );
    // merge networks by layer and then sort by layer title
    const sectionLists = filteredNetworks
      .reduce((result: RadioItemProps[], curr, currentIndex) => {
        result[curr.layer] =
          {
            title: `Layer ${curr.layer}`,
            data: [
              ...(result[curr.layer]?.data || []),
              {
                disabled: curr.disabled,
                key: currentIndex,
                index: currentIndex,
                label: curr.name,
                value: curr.value,
                selected: toLower(selectedNetwork) === toLower(curr.value),
                default: curr.value === defaultNetwork,
              },
            ],
          } || {};

        return result;
      }, [])
      .reduce((acc: RadioItemProps[], val) => acc.concat(val), [])
      .sort((a: RadioItemProps, b: RadioItemProps) =>
        `${a.title}` < `${b.title}` ? 1 : -1
      );

    return sectionLists;
  }, [selectedNetwork, showTestnets]);

  useEffect(() => {
    if (networkSelected.isTestnet !== showTestnets) {
      dispatch(toggleShowTestnets());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (network) {
      setSelectedNetwork(network);
    }
  }, [network, setSelectedNetwork]);

  const onNetworkChange = useCallback(
    async selected => {
      if (selected) {
        setSelectedNetwork(selected);
      }
    },
    [setSelectedNetwork]
  );

  const updateNetwork = useCallback(() => {
    dispatch(settingsUpdateNetwork(selectedNetwork));
  }, [dispatch, selectedNetwork]);

  const onShowTestsPress = useCallback(() => dispatch(toggleShowTestnets()), [
    dispatch,
  ]);

  const isSameNetwork = useMemo(() => selectedNetwork === network, [
    network,
    selectedNetwork,
  ]);

  return {
    isSameNetwork,
    showTestnets,
    sectionListItems,
    onNetworkChange,
    updateNetwork,
    onShowTestsPress,
  };
};
