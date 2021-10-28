import { toLower, values } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import networkInfo from '../../helpers/networkInfo';
import { useAccountSettings } from '../../hooks';
import {
  INITIAL_STATE,
  settingsUpdateNetwork,
  toggleShowTestnets,
} from '../../redux/settings';

import {
  Button,
  Checkbox,
  Container,
  RadioList,
  Text,
} from '@cardstack/components';

const networks = values(networkInfo);

const NetworkSection = () => {
  const { network, showTestnets } = useAccountSettings();
  const [selectedNetwork, setSelectedNetwork] = useState(network);
  const dispatch = useDispatch();
  const networkSelected = networkInfo[network];
  const defaultNetwork = INITIAL_STATE.network;

  //transform data for sectionList
  const DATA = useMemo(
    () =>
      networks
        .filter(item => (showTestnets ? true : !item.isTestnet))
        .reduce((result, curr, currentIndex) => {
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
        .sort((a, b) => a.layer < b.layer),
    [defaultNetwork, selectedNetwork, showTestnets]
  );

  useEffect(() => {
    if (networkSelected.isTestnet !== showTestnets) {
      dispatch(toggleShowTestnets(networkSelected.isTestnet));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <Container backgroundColor="white" paddingVertical={4} width="100%">
      <Container flexDirection="row" padding={4}>
        <Container alignItems="center" flex={1} flexDirection="row">
          <Text>ADVANCED USERS</Text>
        </Container>
        <Checkbox
          isSelected={showTestnets}
          label="Show testnets"
          onPress={onShowTestsPress}
        />
      </Container>
      <RadioList items={DATA} onChange={onNetworkChange} />
      <Container marginTop={4} paddingHorizontal={4}>
        <Button
          disabled={selectedNetwork === network}
          onPress={updateNetwork}
          width="100%"
        >
          Update
        </Button>
      </Container>
    </Container>
  );
};

export default NetworkSection;
