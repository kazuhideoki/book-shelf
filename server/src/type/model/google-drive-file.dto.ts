export class DriveFiles {
  kind: string;
  nextPageToken: string;
  incompleteSearch: boolean;
  files: DriveFile[];
}

export class DriveFile {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
}
