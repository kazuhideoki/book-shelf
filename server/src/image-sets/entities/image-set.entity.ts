export type ImageSetMeta = {
  title?: string;
  pages: number;
};

export class ImageSet {
  accountId: string;
  fileId: string;
  path: string;
  meta: ImageSetMeta;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
