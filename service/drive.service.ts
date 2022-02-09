export class FrontDriveService {
  static authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/drive&access_type=offline&include_granted_scopes=true&redirect_uri=${process.env.NEXT_PUBLIC_WEB_SERVICE_URL}&response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID}`;
}
