import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Sheet } from '../.';

const Stack = createStackNavigator();

const reactNavigationDecorator = story => {
  const Screen = () => story();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="MyStorybookScreen"
          component={Screen}
          options={{ header: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

storiesOf('Sheet', module)
  .addDecorator(reactNavigationDecorator)
  .add('Default', () => <Sheet />);
