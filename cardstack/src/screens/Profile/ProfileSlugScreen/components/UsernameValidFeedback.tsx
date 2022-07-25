import React, { memo, useMemo } from 'react';

import { Container, Text, Icon, IconName } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

import { strings } from '../strings';

interface UsernameValidFeedbackProps {
  invalidMessage?: string;
  validMessage?: string;
}

interface UsernameFeedbackType {
  iconName: IconName;
  iconColor: ColorTypes;
  description: string;
}

const layouts = {
  smallTextSize: 12,
};

// TODO: Add animation on show/hide
const UsernameValidFeedback = ({
  invalidMessage,
  validMessage,
}: UsernameValidFeedbackProps) => {
  const attr: UsernameFeedbackType = useMemo(
    () =>
      !invalidMessage
        ? {
            iconName: 'check',
            iconColor: 'lightGreen',
            description: validMessage || strings.input.valid,
          }
        : {
            iconName: 'x',
            iconColor: 'red',
            description: invalidMessage,
          },
    [invalidMessage, validMessage]
  );

  return (
    <Container flexDirection="row" alignItems="center" paddingBottom={3}>
      <Icon name={attr.iconName} color={attr.iconColor} size={14} />
      <Text fontSize={layouts.smallTextSize} color="white" paddingLeft={1}>
        {attr.description}
      </Text>
    </Container>
  );
};

export default memo(UsernameValidFeedback);
