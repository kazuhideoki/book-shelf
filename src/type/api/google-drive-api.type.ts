import { UserAuth } from "../model/firestore-user.type";

export type GetAccessToken = {
  code: string;
  userId: string;
  userAuth: UserAuth;
};

export type ListDriveFiles = {
  q: string; // https://developers.google.com/drive/api/v3/search-files
  pageSize?: number;
  pageToken?: string;
};
