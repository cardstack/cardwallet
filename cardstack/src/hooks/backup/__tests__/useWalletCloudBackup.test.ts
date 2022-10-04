describe('useWalletCloudBackup', () => {
  describe('Backup to Cloud', () => {
    it.todo(`should show an Alert if iCloud isn't configure on iOS`);
    it.todo(`should call backupWalletToCloud with the correct params`);
    it.todo(
      `should update Redux with the wallet ID and filename if backupWalletToCloud was successful`
    );

    it.todo(`should show an Alert if backupWalletToCloud wasn't successful`);
  });

  describe('Delete Backup from Cloud', () => {
    it.todo(`should show an Alert with two options: confirm and cancel`);
    it.todo(`should delete all files in the remote directory on confirm press`);
    it.todo(
      `should update Redux resetting the cloud backup flags to false/undefined`
    );

    it.todo(`should show an Alert confirming that the deletion was successful`);
    it.todo(`should show an Alert if the deletion failed`);
  });
});
