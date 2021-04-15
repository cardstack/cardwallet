import analytics from '@segment/analytics-react-native';
import { toLower, values } from 'lodash';
import React, { useCallback } from 'react';
import { InteractionManager, SectionList } from 'react-native';
import { useDispatch } from 'react-redux';
import networkInfo from '../../helpers/networkInfo';
import {
  useAccountSettings,
  useInitializeAccountData,
  useLoadAccountData,
  useResetAccountState,
} from '../../hooks';
import { dataGetTransactions } from '../../redux/data';
import { settingsUpdateNetwork } from '../../redux/settings';
import { RadioList, RadioListItem } from '../radio-list';
import {
  Container,
  Icon,
  ListItem,
  OptionItem,
  Text,
} from '@cardstack/components';

const networks = values(networkInfo);

const NetworkSection = () => {
  const { network } = useAccountSettings();
  const resetAccountState = useResetAccountState();
  const loadAccountData = useLoadAccountData();
  const initializeAccountData = useInitializeAccountData();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(network);

  const DATA = networks
    .filter(({ disabled }) => !disabled)
    .map(({ disabled, name, value, layer }) => ({
      title: layer,
      data: [
        {
          disabled,
          key: value,
          label: name,
          selected: toLower(network) === toLower(value),
          value,
        },
      ],
    }));

  const onNetworkChange = useCallback(
    async network => {
      await resetAccountState();
      await dispatch(settingsUpdateNetwork(network));
      InteractionManager.runAfterInteractions(async () => {
        await loadAccountData(network);
        // initializeAccountData();
        await initializeAccountData();
        dispatch(dataGetTransactions());
        analytics.track('Changed network', { network });
      });
      setSelected(network);
    },
    [dispatch, initializeAccountData, loadAccountData, resetAccountState]
  );
  console.log('networks', networks);

  //  [{"color": "#3cc29e", "disabled": false, "exchange_enabled": true, "faucet_url": null, "layerType": 2, "name": "xDai", "value": "mainnet"}, {"color": "#ff4a8d", "disabled": false, "exchange_enabled": false, "faucet_url": "http://faucet.metamask.io/", "layerType": 2, "name": "Sokol", "value": "sokol"}]}

  console.log('-----------------------', { DATA });

  // [{"data": [Array], "title": 2}, {"data": [Array], "title": 2}]}

  // const DATA = [
  //   {
  //     title: 'hello',
  //     data: [
  //       {
  //         color: '#3cc29e',
  //         disabled: false,
  //         exchange_enabled: true,
  //         faucet_url: null,
  //         layer: 2,
  //         name: 'xDai',
  //         value: 'mainnet',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'hello',
  //     data: [
  //       {
  //         color: '#3cc29e',
  //         disabled: false,
  //         exchange_enabled: true,
  //         faucet_url: null,
  //         layer: 2,
  //         name: 'xDai',
  //         value: 'mainnet',
  //       },
  //     ],
  //   },
  // ];

  // const handleChange = selected => {
  //   setSelected(selected.value);
  //   onNetworkChange();
  // };

  const Item = ({ label, disabled, selected }) => {
    console.log('---------------ITEM COMPONENT---------------------', label);
    return (
      <Container borderWidth={1}>
        <OptionItem
          iconProps={{ name: 'check' }}
          // onPress={onNetworkChange}
          opacity={disabled ? 0.42 : 1}
          title={label}
        />
      </Container>
    );
  };
  return (
    <SectionList
      extraData={network}
      keyExtractor={(network, index) => network + index}
      renderItem={({ item }) => {
        console.log('---------RENDER ITEM----------', item);
        return <Item {...item} />;
      }}
      renderSectionHeader={({ section: { title } }) => (
        <Text>Layer {title}</Text>
      )}
      sections={DATA}
    />
    // <SectionList
    //   data={networks}
    //   // keyExtractor={(item, index) => item}
    //   renderItem={RadioListItem}
    //   renderSectionHeader={({ section: { layerType } }) => (
    //     <Text>{layerType}</Text>
    //   )}
    //   sections={networks.sort(network => network.layerType)}
    // />
    // <RadioList
    //   extraData={network}
    //   items={networks
    //     .filter(({ disabled }) => !disabled)
    //     .map(({ disabled, name, value }) => ({
    //       disabled,
    //       key: value,
    //       label: name,
    //       selected: toLower(network) === toLower(value),
    //       value,
    //     }))}
    //   marginTop={7}
    //   onChange={onNetworkChange}
    //   renderItem={RadioListItem}
    //   value={network}
    // />
  );
};

export default NetworkSection;
