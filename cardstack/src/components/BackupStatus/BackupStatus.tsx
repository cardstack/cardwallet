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
  stroke?: ColorTypes;
}

const config: Record<BackupStatusProps['status'], ConfigProps> = {
  success: {
    copy: 'Backed up',
    color: 'lightGreen',
    iconName: 'check-circle',
    stroke: undefined,
  },
  missing: {
    copy: 'Not Backed Up',
    color: 'orange',
    iconName: 'warning',
    stroke: 'black',
  },
};

export const BackupStatus = memo(({ status }: BackupStatusProps) => (
  <Container flexDirection="row" alignItems="flex-end">
    <Icon
      name={config[status].iconName}
      stroke={config[status].stroke}
      iconSize="medium"
      marginRight={3}
    />
    <Text variant="semibold" fontSize={13} color={config[status].color}>
      {config[status].copy}
    </Text>
  </Container>
));
