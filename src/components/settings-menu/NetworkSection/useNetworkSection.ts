import { toLower, values } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import networkInfo from '../../../helpers/networkInfo';
import { useAccountSettings } from '../../../hooks';
import { INITIAL_STATE, settingsUpdateNetwork } from '../../../redux/settings';
import { RadioItemProps } from '@cardstack/components';

const networks = values(networkInfo);
const defaultNetwork = INITIAL_STATE.network;

export const useNetworkSection = () => {
  const { network } = useAccountSettings();
  const dispatch = useDispatch();
  const [selectedNetwork, setSelectedNetwork] = useState(network);
  const [isShowAllNetworks, setShowAllNetworks] = useState<boolean>(false);
  const selectedNetworkInfo = useMemo(() => networkInfo[network], [network]);

  // transform data for sectionList
  const sectionListItems = useMemo(() => {
    const filteredNetworks = networks.filter(item =>
      isShowAllNetworks ? true : !item.isTestnet
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
      .flat()
      .sort((a: RadioItemProps, b: RadioItemProps) =>
        `${a.title}` < `${b.title}` ? 1 : -1
      );

    return sectionLists;
  }, [selectedNetwork, isShowAllNetworks]);

  useEffect(() => {
    if (selectedNetworkInfo.isTestnet !== isShowAllNetworks) {
      setShowAllNetworks(selectedNetworkInfo.isTestnet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetworkInfo.isTestnet]);

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

  const onToggleShowAllNetworks = useCallback(
    () => setShowAllNetworks(isShowAll => !isShowAll),
    []
  );

  const isSelectedCurrentNetwork = useMemo(() => selectedNetwork === network, [
    network,
    selectedNetwork,
  ]);

  return {
    isSelectedCurrentNetwork,
    isShowAllNetworks,
    sectionListItems,
    onNetworkChange,
    updateNetwork,
    onToggleShowAllNetworks,
  };
};
