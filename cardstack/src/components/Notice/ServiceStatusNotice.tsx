import React, { useCallback } from 'react';
import { Linking } from 'react-native';

import { Container, Notice } from '@cardstack/components';
import { useGetServiceStatusQuery } from '@cardstack/services';

export const ServiceStatusNotice = () => {
  const { data } = useGetServiceStatusQuery();

  const handleOnPress = useCallback(() => {
    Linking.openURL(`https://status.cardstack.com`);
  }, []);

  return (
    <Container marginHorizontal={4} marginVertical={2}>
      <Notice
        isVisible={true}
        description={data?.name || 'Information available.'}
        type="info"
        onPress={handleOnPress}
      />
      <Container paddingTop={2} />
      <Notice
        isVisible={true}
        description={data?.name || 'Warning reported.'}
        type="warning"
        onPress={handleOnPress}
      />
      <Container paddingTop={2} />
      <Notice
        isVisible={true}
        description={data?.name || 'Incident reported.'}
        type="error"
        onPress={handleOnPress}
      />
      <Container paddingTop={2} />
      <Notice
        isVisible={true}
        description={data?.name || 'Incident reported.'}
        type="info"
      />
    </Container>
  );
};
