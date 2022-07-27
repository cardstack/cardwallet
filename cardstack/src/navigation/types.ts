import { createStackNavigator } from '@react-navigation/stack';

export interface RouteType<Params> {
  params: Params;
  key: string;
  name: string;
}

export type StackType = ReturnType<typeof createStackNavigator>;
