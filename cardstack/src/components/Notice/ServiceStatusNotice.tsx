import React from 'react';
import { Linking } from 'react-native';

import { Notice, Icon } from '@cardstack/components';

export const ServiceStatusNotice = () => {
  return (
    <>
      <Notice description="Experiencing slow service" type="info" />
      <Notice description="Experiencing slow service" type="warning" />
      <Notice
        description="Experiencing slow service, have you tried turning blockchain off and on again?"
        type="error"
      />
      <Notice
        description="Cardstack Website"
        type="info"
        icon={<Icon iconSize="medium" name="cardstack" />}
        onPress={() => {
          Linking.openURL(`https://cardstack.com`);
        }}
      />
    </>
  );
};
