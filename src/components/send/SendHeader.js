import { useNavigation } from '@react-navigation/native';
import { get, isEmpty, isNumber, toLower } from 'lodash';
import React, { Fragment, useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { Text } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';

import { useClipboard, useDimensions } from '@rainbow-me/hooks';
import { padding } from '@rainbow-me/styles';
import colors, { getRandomColor } from '@rainbow-me/styles/colors';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

import Divider from '../Divider';
import { AddContactButton, PasteAddressButton } from '../buttons';
import { AddressField } from '../fields';
import { Row } from '../layout';

const AddressInputContainer = styled(Row).attrs({ align: 'center' })`
  ${({ isSmallPhone }) => (isSmallPhone ? padding(12, 15) : padding(19, 15))};
  background-color: ${colors.white};
  overflow: hidden;
  width: 100%;
`;

const DefaultContactItem = {
  address: '',
  color: 0,
  nickname: '',
};

export default function SendHeader({
  contacts,
  isValidAddress,
  onChangeAddressInput,
  onPressPaste,
  recipient,
  recipientFieldRef,
  removeContact,
  showAssetList,
  onInvalidPaste,
}) {
  const { setClipboard } = useClipboard();
  const { isSmallPhone } = useDimensions();
  const { navigate } = useNavigation();

  const contact = useMemo(() => {
    return get(contacts, `${[toLower(recipient)]}`, DefaultContactItem);
  }, [contacts, recipient]);

  const handleNavigateToContact = useCallback(() => {
    let color = get(contact, 'color');
    if (!isNumber(color)) {
      color = getRandomColor();
    }

    navigate(Routes.MODAL_SCREEN, {
      additionalPadding: true,
      address: recipient,
      color,
      contact: isEmpty(contact.address) ? false : contact,
      type: 'contact_profile',
    });
  }, [contact, navigate, recipient]);

  const handleOpenContactActionSheet = useCallback(async () => {
    return showActionSheetWithOptions(
      {
        cancelButtonIndex: 3,
        destructiveButtonIndex: 0,
        options: [
          'Delete Contact', // <-- destructiveButtonIndex
          'Edit Contact',
          'Copy Address',
          'Cancel', // <-- cancelButtonIndex
        ],
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          showActionSheetWithOptions(
            {
              cancelButtonIndex: 1,
              destructiveButtonIndex: 0,
              options: ['Delete Contact', 'Cancel'],
            },
            async innerButtonIndex => {
              if (innerButtonIndex === 0) {
                removeContact(recipient);
              }
            }
          );
        } else if (buttonIndex === 1) {
          handleNavigateToContact();
        } else if (buttonIndex === 2) {
          setClipboard(recipient);
        }
      }
    );
  }, [handleNavigateToContact, recipient, removeContact, setClipboard]);

  const isPreExistingContact = (contact?.nickname?.length || 0) > 0;

  return (
    <Fragment>
      <AddressInputContainer isSmallPhone={isSmallPhone}>
        <Text fontSize={15} marginRight={2} weight="bold">
          To:
        </Text>
        <AddressField
          address={recipient}
          autoFocus={!showAssetList}
          name={contact.nickname}
          onChange={onChangeAddressInput}
          ref={recipientFieldRef}
          testID="send-asset-form-field"
        />
        {isValidAddress && (
          <AddContactButton
            edit={isPreExistingContact}
            onPress={
              isPreExistingContact
                ? handleOpenContactActionSheet
                : handleNavigateToContact
            }
          />
        )}
        {!isValidAddress && (
          <PasteAddressButton
            onInvalidPaste={onInvalidPaste}
            onPress={onPressPaste}
          />
        )}
      </AddressInputContainer>
      <Divider color={colors.rowDivider} flex={0} inset={false} />
    </Fragment>
  );
}
