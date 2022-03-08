export type DriveFiles = {
  kind: string;
  nextPageToken: string;
  incompleteSearch: boolean;
  files: DriveFile[];
};

export type DriveFile = {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
};
