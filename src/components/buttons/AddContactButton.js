import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';

import { Button, Icon, Touchable } from '@cardstack/components';

const duration = 200;
const transition = (
  <Transition.Sequence>
    <Transition.Together>
      <Transition.Out
        durationMs={duration * 0.666}
        interpolation="easeIn"
        type="fade"
      />
      <Transition.Out
        durationMs={duration * 0.42}
        interpolation="easeIn"
        type="slide-right"
      />
    </Transition.Together>
    <Transition.Change durationMs={duration} interpolation="easeInOut" />
    <Transition.Together>
      <Transition.In
        durationMs={duration}
        interpolation="easeOut"
        type="fade"
      />
      <Transition.In
        durationMs={duration * 0.5}
        interpolation="easeOut"
        type="slide-right"
      />
    </Transition.Together>
  </Transition.Sequence>
);

const AddContactButton = ({ edit, onPress }) => {
  const addButtonRef = useRef();
  const editButtonRef = useRef();

  useEffect(() => {
    addButtonRef.current?.animateNextTransition();
    editButtonRef.current?.animateNextTransition();
  }, [edit]);

  return (
    <View>
      {edit ? (
        <Transitioning.View ref={editButtonRef} transition={transition}>
          <Touchable onPress={onPress}>
            <Icon color="black" name="more-horizontal" />
          </Touchable>
        </Transitioning.View>
      ) : (
        <Transitioning.View ref={addButtonRef} transition={transition}>
          <Button onPress={onPress} variant="tinyDark">
            Add
          </Button>
        </Transitioning.View>
      )}
    </View>
  );
};

export default React.memo(AddContactButton);
