declare module 'react-native-cloud-fs' {
  export interface BackupFile {
    name: string;
    id: string;
    path: string; // iOS only
    lastModified: string;
  }

  interface ListFilesResult {
    files: BackupFile[];
  }

  interface RNCloudFSMethods {
    logout(): Promise<void>;
    loginIfNeeded(): Promise<void>;
    listFiles(listFilesParams: {
      scope: StringMap;
      targetPath: string;
    }): Promise<ListFilesResult>;
    deleteFromCloud(file: BackupFile): Promise<void>;
    copyToCloud(copyToCloudParams: {
      mimeType: string;
      scope: string;
      sourcePath: { path: string };
      targetPath: string;
    });
    fileExists(fileExistsParam: {
      scope: string;
      targetPath?: string;
      fileId?: string;
    }): Promise<boolean>;
    getIcloudDocument(filename: string): Promise<string>; // iOS only
    getGoogleDriveDocument(id: string): Promise<string>; // android only
    syncCloud(): Promise<boolean>; // iOS only
    isAvailable(): Promise<boolean>; // iOS only
  }
  const RNCloudFS: RNCloudFSMethods;
  export default RNCloudFS;
}
