export class DisplaySet {
  accountId: string;
  displaySetId: string;
  name: string;
  files: {
    fileId: string;
    index: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
