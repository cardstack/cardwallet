import React, { memo } from 'react';

import { Container, HorizontalDivider, Text } from '@cardstack/components';
import { NetworkBadge } from '@cardstack/components/NetworkBadge';

import { ContactAvatar } from '@rainbow-me/components/contacts';

import { SectionHeaderText } from './SectionHeaderText';

interface Props {
  headerText: string;
  title: string;
  showNetworkBadge?: boolean;
  address?: string;
  icon?: Element;
  avatarInfo?: {
    color?: string;
    name: string;
    textColor?: string;
  };
  footer?: Element;
  hideDivider?: boolean;
}

const containerPaddingHorizontal = 3;
const textMarginLeftNoIcon = 12 - containerPaddingHorizontal;

const TransactionListItem = ({
  headerText,
  title,
  showNetworkBadge,
  address,
  icon,
  avatarInfo,
  footer,
  hideDivider,
}: Props) => {
  const hasIcon = icon || avatarInfo;

  return (
    <>
      <SectionHeaderText>{headerText}</SectionHeaderText>
      <Container paddingHorizontal={containerPaddingHorizontal} marginTop={4}>
        <Container flexDirection="row">
          {hasIcon &&
            (avatarInfo ? (
              <ContactAvatar
                color={avatarInfo?.color}
                size="smaller"
                value={avatarInfo?.name}
                textColor={avatarInfo?.textColor}
              />
            ) : (
              <Container paddingTop={1}>{icon}</Container>
            ))}
          <Container marginLeft={hasIcon ? 4 : textMarginLeftNoIcon}>
            <Text weight="extraBold">{title}</Text>
            {showNetworkBadge && <NetworkBadge marginTop={2} />}
            {address ? (
              <Container maxWidth={180} marginTop={1}>
                <Text variant="subAddress">{address}</Text>
              </Container>
            ) : null}
            {footer}
          </Container>
        </Container>
      </Container>
      {!hideDivider && <HorizontalDivider />}
    </>
  );
};

export default memo(TransactionListItem);
