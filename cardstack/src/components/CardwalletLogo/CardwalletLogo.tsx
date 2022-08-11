import React, { memo } from 'react';

import { CenteredContainer, Image } from '@cardstack/components';

import CardstackWalletLogo from '../../assets/logo-with-name.png';

export const CardwalletLogo = memo(() => (
  <CenteredContainer>
    <Image source={CardstackWalletLogo} />
  </CenteredContainer>
));
