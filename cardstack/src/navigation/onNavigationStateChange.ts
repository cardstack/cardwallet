import { Navigation } from '@rainbow-me/navigation';
import { sentryUtils } from '@rainbow-me/utils';

let memRouteName: string;

export function onNavigationStateChange() {
  const { name: routeName } = Navigation.getActiveRoute();

  const prevRouteName = memRouteName;
  memRouteName = routeName;

  if (routeName !== prevRouteName) {
    sentryUtils.addNavBreadcrumb(prevRouteName, routeName);
  }
}
