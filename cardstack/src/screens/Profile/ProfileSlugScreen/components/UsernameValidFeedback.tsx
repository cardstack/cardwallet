import React, { memo, useMemo, useLayoutEffect } from 'react';

import { Container, Text, Icon, IconName } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';
import { layoutEasingAnimation } from '@cardstack/utils';

import { strings } from '../strings';

interface UsernameValidFeedbackProps {
  message?: string;
  isValid?: boolean;
  isVisible?: boolean;
}

interface UsernameFeedbackType {
  iconName: IconName;
  iconColor: ColorTypes;
  description: string;
}

const UsernameValidFeedback = ({
  message,
  isValid,
  isVisible = true,
}: UsernameValidFeedbackProps) => {
  const attr: UsernameFeedbackType = useMemo(
    () =>
      isValid
        ? {
            iconName: 'check',
            iconColor: 'lightGreen',
            description: message || strings.input.valid,
          }
        : {
            iconName: 'x',
            iconColor: 'red',
            description: message || strings.input.invalid,
          },
    [message, isValid]
  );

  useLayoutEffect(() => {
    layoutEasingAnimation();
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <Container flexDirection="row" alignItems="center" paddingBottom={3}>
          <Icon name={attr.iconName} color={attr.iconColor} size={14} />
          <Text fontSize={12} color="white" paddingLeft={1}>
            {attr.description}
          </Text>
        </Container>
      )}
    </>
  );
};

export default memo(UsernameValidFeedback);
