import React, { useEffect, useState } from 'react';
import { web3Provider } from '../../handlers/web3';
import networkInfo from '../../helpers/networkInfo';
import { useAccountSettings, useInternetStatus } from '../../hooks';
import { Nbsp, Text } from '../text';
import Toast from './Toast';
import networkTypes from '@rainbow-me/helpers/networkTypes';

const NetworkToast = () => {
  const isConnected = useInternetStatus();
  const { network } = useAccountSettings();
  const providerUrl = web3Provider?.connection?.url;
  const { name, isTestnet } = networkInfo[network];
  const [visible, setVisible] = useState(isTestnet);
  const [networkName, setNetworkName] = useState(name);

  useEffect(() => {
    setVisible(isConnected && network !== networkTypes.xdai);
    setNetworkName(networkInfo[network].shortName);
  }, [name, network, providerUrl, isConnected, isTestnet, networkName]);

  const { colors } = useTheme();

  return (
    <Toast isVisible={visible} testID={`network-toast-${networkName}`}>
      <Text color={colors.white} size="smedium" weight="semibold">
        <Nbsp /> {networkName} <Nbsp />
      </Text>
    </Toast>
  );
};

export default NetworkToast;
