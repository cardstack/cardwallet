import React, { memo } from 'react';

import { Container, Icon, IconName, Text } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

interface BackupStatusProps {
  status: 'success' | 'missing';
}

interface ConfigProps {
  copy: string;
  color: ColorTypes;
  iconName: IconName;
}

export const BackupStatus = memo(({ status }: BackupStatusProps) => {
  const successConfig: ConfigProps = {
    copy: 'Backed up',
    color: 'lightGreen',
    iconName: 'check-circle',
  };

  const missingConfig: ConfigProps = {
    copy: 'Not Backed Up',
    color: 'orange',
    iconName: 'warning',
  };

  const statusConfig = status === 'success' ? successConfig : missingConfig;
  const hasStroke = status !== 'success' ? 'black' : undefined;

  return (
    <Container flexDirection="row" alignItems="center">
      <Icon
        name={statusConfig.iconName}
        stroke={hasStroke}
        size={20}
        marginRight={3}
      />
      <Text variant="semibold" fontSize={13} color={statusConfig.color}>
        {statusConfig.copy}
      </Text>
    </Container>
  );
});
