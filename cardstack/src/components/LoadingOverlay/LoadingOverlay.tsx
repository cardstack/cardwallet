import React, { memo } from 'react';
import { ActivityIndicator } from 'react-native';

import {
  OverlayContainer,
  CenteredContainer,
  Text,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';

const LoadingOverlay = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string;
}) => (
  <OverlayContainer>
    <CenteredContainer paddingTop={2}>
      <ActivityIndicator color={colors.blueText} />
      <Text color="black" marginTop={5} fontSize={18} weight="bold">
        {title}
      </Text>
      {!!subTitle && (
        <Text color="blueText" marginTop={1} size="body" textAlign="center">
          {subTitle}
        </Text>
      )}
    </CenteredContainer>
  </OverlayContainer>
);

export default memo(LoadingOverlay);
