/* eslint-disable import/no-anonymous-default-export */
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthResponse } from "../../../type/google-drive-api.type";
import { axiosRequest } from "../../../utils/axios";

const fileId = "1etL4N_wtxozkzGoKcMlmY_md0jGrDwmK";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("⭐ api/files");

  if (req.method === "GET") {
    const { access_token, refresh_token } = req.query as AuthResponse;

    // const { access_token, refresh_token } = authResponse as AuthResponse;

    console.log({ access_token });

    // const response = await fetch(
    //   `https://www.googleapis.com/drive/v3/files/${testFileId}?access_token=${access_token}`
    // );
    const response: any = await axiosRequest(
      "GET",
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        responseEncoding: "base64",
      }
    );

    const oauthClient = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID,
      process.env.GOOGLE_DRIVE_API_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_WEB_SERVICE_URL
    );

    oauthClient.credentials = {
      access_token,
      refresh_token,
    };
    const drive = google.drive({
      version: "v3",
      auth: oauthClient,
    });

    // drive.files.get(
    //   { auth: oauthClient, fileId: fileId, alt: "media" },
    //   {
    //     responseType: "stream",
    //   },
    //   async function (err, response) {
    //     if (err) return console.log({ err });

    //     console.log(`done!! ${response}`);

    //     res.setHeader("Content-Type", "application/pdf");
    //     return res.json(response?.data);
    //   }
    // );

    return res.status(200).json(response);
  }
};

function toArrayBuffer(buf: any) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
