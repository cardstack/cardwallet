import analytics from '@segment/analytics-react-native';
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
import { settingsUpdateNetwork } from '../../redux/settings';

import { Checkbox, Container, RadioList, Text } from '@cardstack/components';

const networks = values(networkInfo);

const NetworkSection = () => {
  const { network } = useAccountSettings();
  const resetAccountState = useResetAccountState();
  const loadAccountData = useLoadAccountData();
  const initializeAccountData = useInitializeAccountData();
  const dispatch = useDispatch();
  const [showTestnets, setShowTestnets] = useState(true);

  //transform data for sectionList
  const DATA = networks
    .filter((item) => showTestnets ? true : !item.isTestnet)
    .reduce((result, curr, currentIndex) => {
      result[curr.layer] =
        {
          title: `Layer ${curr.layer}`,
          data: [
            ...(result[curr.layer]?.data || []),
            {
              disabled: curr.disabled,
              key: currentIndex,
              label: curr.name,
              value: curr.value,
              selected: toLower(network) === toLower(curr.value),
              default: curr.default,
            },
          ],
        } || {};

      return result;
    }, [])
    .flat()
    .sort((a, b) => a.layer < b.layer);

  const onNetworkChange = useCallback(
    async network => {
      await resetAccountState();
      await dispatch(settingsUpdateNetwork(network));
      InteractionManager.runAfterInteractions(async () => {
        await loadAccountData(network);
        initializeAccountData();
        analytics.track('Changed network', { network });
      });
    },
    [dispatch, initializeAccountData, loadAccountData, resetAccountState]
  );

  return (
    <Container backgroundColor="white" paddingVertical={4} width="100%">
      <Container flexDirection="row" padding={4}>
        <Container alignItems="center" flex={1} flexDirection="row">
          <Text>ADVANCED USERS</Text>
        </Container>
        <Checkbox label="Show testnets" isSelected={showTestnets} onPress={() => setShowTestnets(!showTestnets)} />
      </Container>
      <RadioList items={DATA} onChange={value => onNetworkChange(value)} />
    </Container>
  );
};

export default NetworkSection;
