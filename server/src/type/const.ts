export class FrontPath {
  static top = '/';
  static settings = '/settings';
}

export class ServerPath {
  static self = `/self`;

  static files = `/files`;
  static imageSets = `/image-sets`;
  static imageSet = (fileId: string) => `${ServerPath.imageSets}/${fileId}`;
  static displaySets = `/display-sets`;
}

export class ExternalPath {
  static googleapiToken = `https://www.googleapis.com/oauth2/v4/token`;

  static driveRoute = `https://www.googleapis.com/drive/v3`;

  static files = `${ExternalPath.driveRoute}/files`;
  static file = (fileId: string) => `${ExternalPath.files}/${fileId}`;
}

export class StoragePath {
  static pdfFile = (accountId: string, fileId: string) =>
    `files/${accountId}/${fileId}.pdf`;
  static imageFile = (accountId: string, fileId: string) =>
    `files/${accountId}/${fileId}.png`;
}
