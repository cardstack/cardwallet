import { SeedPhraseBackupFlow } from './types';

export const strings: Record<
  SeedPhraseBackupFlow,
  { title: string; subtitle: string; button: string }
> = {
  [SeedPhraseBackupFlow.backup]: {
    button: `OK, I've saved my seed phrases`,
    title: 'Backup your seed phrases',
    subtitle:
      'Tap the seed phrases below to copy them. Save them in a secure place.',
  },
  [SeedPhraseBackupFlow.singlewallet]: {
    button: `OK, I've saved my seed phrases`,
    title: 'Cardwallet only supports a single wallet now.',
    subtitle:
      'You have multiple wallets in the app, but moving forward, only the currently selected wallet will be available.\n\nBefore continuing, it is fundamental that you back up your seeds manually. Tap in each seed phrase below to copy it to your clipboard and paste it in a secure place, and write them down on paper.',
  },
};
