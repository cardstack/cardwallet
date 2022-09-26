import { AllRainbowWallets } from '@rainbow-me/model/wallet';

export interface BackedUpData {
  [key: string]:
    | string
    | {
        version: number;
        wallets: AllRainbowWallets;
      };
}

export interface BackupUserData {
  wallets: AllRainbowWallets;
}

export interface ICloudBackupData {
  createdAt: number;
  updatedAt: number;
  secrets?: { [key: string]: string };
  seedPhrase?: string;
}
