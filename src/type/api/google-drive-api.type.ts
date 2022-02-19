export type GetAccessToken = {
  code: string;
};

export type ListDriveFiles = {
  q: string; // https://developers.google.com/drive/api/v3/search-files
  pageSize?: number;
  pageToken?: string;
};

export enum MediaType {
  PDF = "PDF",
  IMAGE = "IMAGE",
}
