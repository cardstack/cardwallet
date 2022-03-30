import React, { memo } from 'react';
import { strings } from './strings';
import { useNetworkSection } from './useNetworkSection';
import { Button, Checkbox, Container, RadioList } from '@cardstack/components';

const NetworkSection = () => {
  const {
    isSameNetwork,
    showTestnets,
    sectionListItems,
    onNetworkChange,
    updateNetwork,
    onShowTestsPress,
  } = useNetworkSection();

  return (
    <Container backgroundColor="white" paddingVertical={4} width="100%">
      <Container flexDirection="row" justifyContent="flex-end" padding={5}>
        <Checkbox
          isSelected={showTestnets}
          label={strings.showAllNetworks}
          onPress={onShowTestsPress}
        />
      </Container>
      <RadioList items={sectionListItems} onChange={onNetworkChange} />
      <Container marginTop={5} paddingHorizontal={5}>
        <Button disabled={isSameNetwork} onPress={updateNetwork} width="100%">
          {strings.update}
        </Button>
      </Container>
    </Container>
  );
};

export default memo(NetworkSection);
