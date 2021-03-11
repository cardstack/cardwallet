import React, { useCallback } from 'react';

import { ListItem } from '../list';
import { Icon } from '@cardstack/components';

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
        <Icon iconSize="medium" name="success" position="absolute" right={0} />
      )}
    </ListItem>
  );
};

export default RadioListItem;
