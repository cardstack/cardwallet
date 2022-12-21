import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useAccountSettings, useContacts } from '../../hooks';
import { magicMemo } from '../../utils';
import Divider from '../Divider';
import { showDeleteContactActionSheet } from '../contacts';
import CopyTooltip from '../copy-tooltip';
import { ProfileAvatarButton, ProfileModal, ProfileNameInput } from './profile';
import {
  AnimatedPressable,
  CenteredContainer,
  OptionItem,
  Text,
  TruncatedAddress,
} from '@cardstack/components';
import theme from '@cardstack/theme';
import { padding } from '@rainbow-me/styles';

const WalletProfileDivider = styled(Divider).attrs(() => ({
  borderRadius: 1,
  color: theme.colors['borderGray'],
  inset: false,
}))``;

const Spacer = styled.View`
  height: 19;
`;

const ContactProfileModal = styled(ProfileModal).attrs({
  dividerRenderer: WalletProfileDivider,
})`
  ${padding(24, 0, 0)};
  width: 100%;
`;

const ContactProfileState = ({ address, color: colorProp, contact }) => {
  const { goBack } = useNavigation();
  const { onAddOrUpdateContacts, onRemoveContact } = useContacts();

  const [color, setColor] = useState(colorProp || 0);
  const [value, setValue] = useState(contact?.nickname || '');
  const inputRef = useRef(null);
  const { network } = useAccountSettings();

  const handleAddContact = useCallback(() => {
    if (value.length > 0 || color !== colorProp) {
      onAddOrUpdateContacts(address, value, color, network);
      goBack();
    }
    android && Keyboard.dismiss();
  }, [
    address,
    color,
    colorProp,
    goBack,
    network,
    onAddOrUpdateContacts,
    value,
  ]);

  const handleDeleteContact = useCallback(() => {
    showDeleteContactActionSheet({
      address,
      nickname: value,
      onDelete: goBack,
      removeContact: onRemoveContact,
    });
    android && Keyboard.dismiss();
  }, [address, goBack, onRemoveContact, value]);

  const handleTriggerFocusInput = useCallback(() => inputRef.current?.focus(), [
    inputRef,
  ]);

  const { colors } = useTheme();

  return (
    <ContactProfileModal onPressBackdrop={handleAddContact}>
      <CenteredContainer paddingBottom={8}>
        <ProfileAvatarButton
          color={color}
          marginBottom={0}
          radiusAndroid={32}
          setColor={setColor}
          value={value}
        />
        <Spacer />
        <ProfileNameInput
          onChange={setValue}
          onSubmitEditing={handleAddContact}
          placeholder="Name"
          ref={inputRef}
          selectionColor={colors.avatarColor[color]}
          testID="contact-profile-name-input"
          value={value}
        />
        <CopyTooltip
          onHide={handleTriggerFocusInput}
          textToCopy={address}
          tooltipText="Copy Address"
        >
          <TruncatedAddress address={address} />
        </CopyTooltip>
      </CenteredContainer>
      <CenteredContainer marginVertical={5}>
        <AnimatedPressable onPress={handleAddContact}>
          <OptionItem
            justifyContent="center"
            testID="wallet-info-submit-button"
            textProps={{ color: 'settingsTeal' }}
            title={contact ? 'Done' : 'Add Contact'}
          />
        </AnimatedPressable>
      </CenteredContainer>
      <CenteredContainer marginBottom={6} marginTop={5}>
        <AnimatedPressable
          onPress={
            contact
              ? handleDeleteContact
              : () => {
                  goBack();
                  android && Keyboard.dismiss();
                }
          }
        >
          <Text color="grayText" textAlign="center" weight="bold">
            {contact ? 'Delete Contact' : 'Cancel'}
          </Text>
        </AnimatedPressable>
      </CenteredContainer>
    </ContactProfileModal>
  );
};

export default magicMemo(ContactProfileState, ['address', 'color', 'contact']);
