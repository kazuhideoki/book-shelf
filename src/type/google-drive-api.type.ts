export type GetAccessToken = {
  code: string;
};

export type AuthResponse = {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type DriveResponse = {
  kind: string;
  nextPageToken: string;
  incompleteSearch: string;
  files: DriveFile[];
};

export type DriveFile = {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
};
