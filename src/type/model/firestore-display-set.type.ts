export type DisplaySet = {
  accountId: string;
  displaySetId: string;
  files: {
    fileId: string;
    index: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
