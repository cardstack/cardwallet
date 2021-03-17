/**
 * The base request type for adding an existing wallet.
 */
export type AddExistingWalletRequest = {
  walletId: string;
};

/**
 * The base return type received from adding an existing wallet.
 */
export type AddExistingWalletResponse = {
  walletId: string;
};
