import React, { useCallback, useMemo } from 'react';
import { useProfileForm } from '../helper';
import { exampleMerchantData, strings } from '.';
import { Button, Container, Text, MerchantSafe } from '@cardstack/components';

export const StepThree = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressCreate = useCallback(() => {}, []);

  const { businessColor, businessName, businessId } = useProfileForm();

  const newMerchantInfo = useMemo(
    () => ({
      color: businessColor,
      name: businessName,
      did: '',
      textColor: '#fff',
      slug: businessId,
      ownerAddress: '',
    }),
    [businessColor, businessId, businessName]
  );

  return (
    <Container
      flexGrow={1}
      flexDirection="column"
      justifyContent="space-between"
      paddingVertical={8}
    >
      <Container>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.review}
        </Text>
        <Text
          color="grayText"
          marginTop={2}
          textAlign="center"
          paddingHorizontal={10}
        >
          {strings.reviewDescription}
        </Text>
      </Container>
      <Container>
        <Text color="white" textAlign="left" paddingLeft={4} marginBottom={1}>
          {strings.yourProfile}
        </Text>
        <MerchantSafe
          {...exampleMerchantData}
          address=""
          merchantInfo={newMerchantInfo}
          disabled
          headerRightText={strings.headerRightText}
        />
      </Container>
      <Container alignItems="center">
        <Button onPress={onPressCreate}>{strings.create}</Button>
      </Container>
    </Container>
  );
};
