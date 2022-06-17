export enum SeedPhraseBackupFlow {
  backup = 'backup',
  singlewallet = 'singlewallet',
}

export interface SeedPhraseBackupParams {
  flow: SeedPhraseBackupFlow;
  seedPhrases: string[];
  onSuccess?: () => void;
}
