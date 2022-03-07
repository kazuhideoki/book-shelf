export class MimeType {
  static folder = "application/vnd.google-apps.folder";
  static file = "application/pdf";
  static inParents = (id: string) => `'${id}' in parents`;
}
