import React, { memo, useMemo, useLayoutEffect } from 'react';

import { Container, Text, Icon, IconName } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';
import { layoutEasingAnimation } from '@cardstack/utils';

interface ValidationMessageProps {
  message?: string;
  isValid?: boolean;
  isVisible?: boolean;
}

interface UsernameFeedbackType {
  iconName: IconName;
  iconColor: ColorTypes;
  description: string;
}

const ValidationMessage = ({
  message = '',
  isValid,
  isVisible = true,
}: ValidationMessageProps) => {
  const attr: UsernameFeedbackType = useMemo(
    () =>
      isValid
        ? {
            iconName: 'check',
            iconColor: 'lightGreen',
            description: message,
          }
        : {
            iconName: 'x',
            iconColor: 'red',
            description: message,
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

export default memo(ValidationMessage);
