import { Navigation } from '@rainbow-me/navigation';
import { sentryUtils } from '@rainbow-me/utils';

let memRouteName: string | undefined;

export function onNavigationStateChange() {
  const routeName = Navigation.getActiveRouteName();

  const prevRouteName = memRouteName;
  memRouteName = routeName;

  if (routeName !== prevRouteName) {
    sentryUtils.addNavBreadcrumb(prevRouteName, routeName);
  }
}
