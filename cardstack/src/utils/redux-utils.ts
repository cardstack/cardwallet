import { Dispatch } from '@reduxjs/toolkit';

/**
 * mapDispatchToActions hook to be called as soon as possible to prepare for purchases.
 * @param dispatch: redux dispatch function
 * @param actions: Array of actions to be dispatched
 * @param args: Array of arguments matching action position to be passed to action
 */
export const mapDispatchToActions = (
  dispatch: Dispatch,
  actions: any[], // Needs to be any for now since we have .js actions
  args?: any[]
) => actions.map((action, idx) => dispatch(action(args?.[idx])));
