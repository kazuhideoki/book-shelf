export class Path {
  static googleapiToken = `https://www.googleapis.com/oauth2/v4/token`;

  static driveRoute = `https://www.googleapis.com/drive/v3`;

  static files = `${Path.driveRoute}/files`;
  static file = (fileId: string) => `${Path.files}/${fileId}`;
}
