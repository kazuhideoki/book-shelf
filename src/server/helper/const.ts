export class FrontPath {
  static top = "/";
  static settings = "/settings";
}

export class ServerPath {
  static files = `/api/files`;
  static file = (fileId: string) => `${ServerPath.files}/${fileId}`;
  static fileMedia = (fileId: string) => `${ServerPath.file(fileId)}/media`;
  static displaySets = `/api/display-sets`;
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
}
