export type ImageSetMeta = {
  title?: string;
  pages: number;
};

export type ImageSet = {
  accountId: string;
  fileId: string;
  path: string;
  meta: ImageSetMeta;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
