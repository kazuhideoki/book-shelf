export type DisplaySet = {
  userId: string;
  displaySetId: string;
  files: {
    fileId: string;
    index: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
