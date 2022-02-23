export class FrontPath {
  static top = "/";
  static settings = "/settings";
}

export class ServerPath {
  static drive = `/api/drive`;
  static driveAuth = `${ServerPath.drive}/auth`;
  static driveToken = `${ServerPath.drive}/token`;
  static files = `/api/files`;
  static file = (fileId: string) => `${ServerPath.files}/${fileId}`;
  static displaySets = `/api/display-sets`;
  static users = `/api/users`;
  static user = (userId: string) => `${ServerPath.users}/${userId}`;
}

export class ExternalPath {
  static googleapiToken = `https://www.googleapis.com/oauth2/v4/token`;

  static driveRoute = `https://www.googleapis.com/drive/v3`;

  static files = `${ExternalPath.driveRoute}/files`;
  static file = (fileId: string) => `${ExternalPath.files}/${fileId}`;
}

export class StoragePath {
  static pdfFile = (userId: string, fileId: string) =>
    `files/${userId}/${fileId}.pdf`;
  static imageFile = (userId: string, fileId: string) =>
    `files/${userId}/${fileId}.png`;
}
