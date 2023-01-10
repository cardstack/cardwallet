import React, { memo } from 'react';

import { Button, Checkbox, Container, RadioList } from '@cardstack/components';

import { strings } from './strings';
import { useNetworkSection } from './useNetworkSection';

const NetworkSection = () => {
  const {
    isCurrentNetworkSelected,
    showAll,
    sectionListItems,
    onNetworkChange,
    onUpdateNetwork,
    onToggleShowAllNetworks,
  } = useNetworkSection();

  return (
    <Container backgroundColor="white" paddingVertical={4} width="100%">
      <Container flexDirection="row" justifyContent="flex-end" padding={5}>
        <Checkbox
          isSelected={showAll}
          label={strings.showAllNetworks}
          onPress={onToggleShowAllNetworks}
        />
      </Container>
      <RadioList items={sectionListItems} onChange={onNetworkChange} />
      <Container marginTop={5} paddingHorizontal={5}>
        <Button
          disabled={isCurrentNetworkSelected}
          onPress={onUpdateNetwork}
          width="100%"
        >
          {strings.update}
        </Button>
      </Container>
    </Container>
  );
};

export default memo(NetworkSection);
