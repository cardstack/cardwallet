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
  const selectedNetworkInfo = useMemo(() => networkInfo[selectedNetwork], [
    selectedNetwork,
  ]);
  const [isShowAllNetworks, setShowAllNetworks] = useState<boolean>(
    selectedNetworkInfo.hidden
  );

  // transform data for sectionList
  const sectionListItems = useMemo(() => {
    const filteredNetworks = networks.filter(
      item => isShowAllNetworks || !item.hidden
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
    setShowAllNetworks(selectedNetworkInfo.hidden);
  }, [selectedNetworkInfo.hidden]);

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
