import { useNavigation, useRoute } from '@react-navigation/native';
import React, { createElement } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components';

import { CopyAddressSheet } from '@cardstack/screens';

import { padding, position } from '@rainbow-me/styles';

import TouchableBackdrop from '../components/TouchableBackdrop';
import {
  ContactProfileState,
  WalletProfileState,
} from '../components/expanded-state';
import { Centered } from '../components/layout';

const ModalTypes = {
  contact_profile: ContactProfileState,
  wallet_profile: WalletProfileState,
  copy_address: CopyAddressSheet,
};

const Container = styled(Centered).attrs({ direction: 'column' })`
  ${({ insets }) => padding(insets.top || 0, 15, 0)};
  ${position.size('100%')};
`;

export default function ModalScreen(props) {
  const insets = useSafeAreaInsets();
  const { goBack } = useNavigation();
  const { params } = useRoute();

  return (
    <Container insets={insets}>
      <TouchableBackdrop onPress={goBack} />
      {createElement(ModalTypes[params.type], {
        ...params,
        ...props,
      })}
    </Container>
  );
}
