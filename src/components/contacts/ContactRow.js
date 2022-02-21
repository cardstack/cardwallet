import React from 'react';

import { removeFirstEmojiFromString } from '../../helpers/emojiHandler';
import { ButtonPressAnimation } from '../animations';
import Column from '../layout/Column';
import RowWithMargins from '../layout/RowWithMargins';
import ContactAvatar from './ContactAvatar';
import { Text, TruncatedAddress } from '@cardstack/components';
import { margin } from '@rainbow-me/styles';
import { magicMemo } from '@rainbow-me/utils';

const ContactRow = ({ address, color, nickname, ...props }, ref) => {
  return (
    <ButtonPressAnimation
      exclusive
      isInteraction
      ref={ref}
      scaleTo={0.98}
      {...props}
    >
      <RowWithMargins css={margin(0, 15, 22)} height={40} margin={15}>
        <ContactAvatar color={color} size="medium" value={nickname} />
        <Column justify={ios ? 'space-between' : 'center'}>
          <Text weight="bold">{removeFirstEmojiFromString(nickname)}</Text>
          <TruncatedAddress
            address={address}
            fontFamily="OpenSans-Regular"
            variant="subText"
          />
        </Column>
      </RowWithMargins>
    </ButtonPressAnimation>
  );
};

export default magicMemo(React.forwardRef(ContactRow), [
  'address',
  'color',
  'nickname',
]);
