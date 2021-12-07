import { InteractionManager } from 'react-native';
import logger from 'logger';

if (!InteractionManager._shimmed) {
  const oldCreateInteractionHandle = InteractionManager.createInteractionHandle;

  InteractionManager.createInteractionHandle = function (
    finishAutomatically = true
  ) {
    const handle = oldCreateInteractionHandle();
    if (finishAutomatically) {
      setTimeout(() => {
        InteractionManager.clearInteractionHandle(handle);
        logger.sentry(`Interaction finished automatically`);
      }, 3000);
    }
    return handle;
  };

  InteractionManager._shimmed = true;
}
