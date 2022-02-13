import { google } from "googleapis";

export const getAuthUrl = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID,
    process.env.GOOGLE_DRIVE_API_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_WEB_SERVICE_URL
  );

  const scopes = ["https://www.googleapis.com/auth/drive"];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
};
