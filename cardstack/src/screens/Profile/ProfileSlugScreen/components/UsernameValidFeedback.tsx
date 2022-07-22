import React, { memo, useMemo } from 'react';

import { Container, Text, Icon, IconName } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

import { strings } from '../strings';

interface UsernameValidFeedbackProps {
  invalidUsernameMessage: string | null;
}

interface UsernameFeedbackType {
  iconName: IconName;
  iconColor: ColorTypes;
  description: string;
}

const layouts = {
  smallTextSize: 12,
};

const UsernameValidFeedback = ({
  invalidUsernameMessage,
}: UsernameValidFeedbackProps) => {
  const attr: UsernameFeedbackType = useMemo(
    () =>
      !invalidUsernameMessage
        ? {
            iconName: 'check',
            iconColor: 'lightGreen',
            description: strings.input.valid,
          }
        : {
            iconName: 'x',
            iconColor: 'red',
            description: invalidUsernameMessage,
          },
    [invalidUsernameMessage]
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
