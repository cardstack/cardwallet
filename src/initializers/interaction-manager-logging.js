import { InteractionManager } from 'react-native';

if (!InteractionManager._shimmed) {
  const oldCreateInteractionHandle = InteractionManager.createInteractionHandle;

  InteractionManager.createInteractionHandle = function (
    finishAutomatically = true
  ) {
    const handle = oldCreateInteractionHandle();
    if (finishAutomatically) {
      setTimeout(() => {
        InteractionManager.clearInteractionHandle(handle);
      }, 3000);
    }
    return handle;
  };

  InteractionManager._shimmed = true;
}
