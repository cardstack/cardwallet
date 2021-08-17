import React from 'react';

import { removeFirstEmojiFromString } from '../../helpers/emojiHandler';
import { magicMemo } from '../../utils';
import { ButtonPressAnimation } from '../animations';
import { Column, RowWithMargins } from '../layout';
import ContactAvatar from './ContactAvatar';
import { Text, TruncatedAddress } from '@cardstack/components';
import { margin } from '@rainbow-me/styles';

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
          <Text fontWeight="600">{removeFirstEmojiFromString(nickname)}</Text>
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
