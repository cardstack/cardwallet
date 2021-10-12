import { toLower, values } from 'lodash';
import React, { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';
import networkInfo from '../../helpers/networkInfo';
import {
  useAccountSettings,
  useInitializeAccountData,
  useLoadAccountData,
  useResetAccountState,
} from '../../hooks';
import {
  INITIAL_STATE,
  settingsUpdateNetwork,
  toggleShowTestnets,
} from '../../redux/settings';

import { Checkbox, Container, RadioList, Text } from '@cardstack/components';

const networks = values(networkInfo);

const NetworkSection = () => {
  const { network, showTestnets } = useAccountSettings();
  const resetAccountState = useResetAccountState();
  const loadAccountData = useLoadAccountData();
  const initializeAccountData = useInitializeAccountData();
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
                  selected: toLower(network) === toLower(curr.value),
                  default: curr.value === defaultNetwork,
                },
              ],
            } || {};

          return result;
        }, [])
        .flat()
        .sort((a, b) => a.layer < b.layer),
    [defaultNetwork, network, showTestnets]
  );

  useEffect(() => {
    if (networkSelected.isTestnet !== showTestnets) {
      dispatch(toggleShowTestnets(networkSelected.isTestnet));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNetworkChange = useCallback(
    async network => {
      if (network) {
        await resetAccountState();
        await dispatch(settingsUpdateNetwork(network));
        InteractionManager.runAfterInteractions(async () => {
          await loadAccountData(network);
          initializeAccountData();
        });
      }
    },
    [dispatch, initializeAccountData, loadAccountData, resetAccountState]
  );

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
    </Container>
  );
};

export default NetworkSection;
