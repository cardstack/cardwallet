import React, { useCallback } from 'react';

import { ListItem } from '../list';
import { CenteredContainer, Icon } from '@cardstack/components';

const RadioListItem = ({ disabled, selected, ...props }) => {
  const onPress = useCallback(() => {
    if (props.onPress && !props.disabled) {
      props.onPress(props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.onPress, disabled]);
  return (
    <ListItem onPress={onPress} opacity={disabled ? 0.42 : 1} {...props}>
      {selected && (
        <CenteredContainer alignItems="flex-end" flex={1}>
          <Icon iconSize="medium" name="success" />
        </CenteredContainer>
      )}
    </ListItem>
  );
};

export default RadioListItem;
