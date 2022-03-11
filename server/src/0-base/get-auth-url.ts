import { google } from 'googleapis';
import { ENV } from '../main';

export const getAuthUrl = () => {
  const oauth2Client = new google.auth.OAuth2(
    ENV.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID,
    ENV.GOOGLE_DRIVE_API_CLIENT_SECRET,
    ENV.NEXT_PUBLIC_WEB_FRONT_URL,
  );

  const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/firebase',
    'https://www.googleapis.com/auth/cloud-platform',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};
