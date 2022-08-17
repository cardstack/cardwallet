import { useNavigation } from '@react-navigation/native';
import { toLower } from 'lodash';
import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components';
import { FlyInAnimation } from '../animations';
import { SwipeableContactRow } from '../contacts';
import { InvalidPasteToast, ToastPositionContainer } from '../toasts';
import SendEmptyState from './SendEmptyState';
import { Routes } from '@cardstack/navigation';
import { filterList } from '@rainbow-me/utils';

const rowHeight = 62;
const getItemLayout = (data, index) => ({
  index,
  length: rowHeight,
  offset: rowHeight * index,
});
const contentContainerStyle = { paddingBottom: 32 };
const keyExtractor = item => `SendContactList-${item.address}`;

const SendContactFlatList = styled(FlatList).attrs({
  alwaysBounceVertical: true,
  contentContainerStyle,
  directionalLockEnabled: true,
  getItemLayout,
  keyboardDismissMode: 'none',
  keyboardShouldPersistTaps: 'always',
  keyExtractor,
})`
  flex: 1;
`;

export default function SendContactList({
  contacts,
  currentInput,
  onPressContact,
  removeContact,
  isInvalidPaste,
}) {
  const { navigate } = useNavigation();

  const contactRefs = useRef({});
  const touchedContact = useRef(undefined);

  const filteredContacts = useMemo(
    () => filterList(contacts, currentInput, ['nickname']),
    [contacts, currentInput]
  );

  const handleCloseAllDifferentContacts = useCallback(address => {
    if (touchedContact.current && contactRefs.current[touchedContact.current]) {
      contactRefs.current[touchedContact.current].close();
    }
    touchedContact.current = toLower(address);
  }, []);

  const handleEditContact = useCallback(
    ({ address, color, nickname }) => {
      navigate(Routes.MODAL_SCREEN, {
        address,
        color,
        contact: { address, color, nickname },
        type: 'contact_profile',
      });
    },
    [navigate]
  );

  const renderItemCallback = useCallback(
    ({ item }) => (
      <SwipeableContactRow
        onPress={onPressContact}
        onSelectEdit={handleEditContact}
        onTouch={handleCloseAllDifferentContacts}
        ref={component => {
          contactRefs.current[toLower(item.address)] = component;
        }}
        removeContact={removeContact}
        {...item}
      />
    ),
    [
      handleCloseAllDifferentContacts,
      handleEditContact,
      onPressContact,
      removeContact,
    ]
  );

  return (
    <FlyInAnimation>
      {filteredContacts.length === 0 ? (
        <SendEmptyState />
      ) : (
        <SendContactFlatList
          data={filteredContacts}
          marginTop={17}
          renderItem={renderItemCallback}
          testID="send-contact-list"
        />
      )}
      <ToastPositionContainer>
        <InvalidPasteToast isInvalidPaste={isInvalidPaste} />
      </ToastPositionContainer>
    </FlyInAnimation>
  );
}
