/* eslint-disable import/no-anonymous-default-export */
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthResponse } from "../../../type/google-drive-api.type";

const fileId = "14y_If6OunynA-KMIYiTPGNldfZ3z8WEb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("⭐ api/files");

  if (req.method === "GET") {
    const { access_token, refresh_token } = req.query as AuthResponse;

    console.log({ access_token });

    // const response = await fetch(
    //   `https://www.googleapis.com/drive/v3/files/${testFileId}?access_token=${access_token}`
    // );
    // const response: any = await axiosRequest(
    //   "GET",
    //   `https://www.googleapis.com/drive/v/files/${testFileId}?alt=media`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`,
    //     },
    //   }
    // );

    // fs.writeFileSync(`./files/${testFileId}.pdf`, response);
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

    // var dest = fs.createWriteStream(`/files/${fileId}.pdf`);
    drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      // {
      //   responseType: "stream",
      // },
      function (err, response) {
        if (err) return console.log({ err });

        console.log(`done!! ${response}`);

        return res.status(200).json(response);
        // response?.data.on("error", (e: any) => {
        //     console.log(`error: ${e}`);
        //     ;
        //   })
        //   .on("end", () => {
        //    console.log(`done!!`);
        //   })
        //   .pipe(dest)
      }
    );

    // console.log({ response: response });
    // const data = fs.readFileSync(`./files/${testFileId}.pdf`, "utf8");

    // console.log({ data });

    // return res.status(200).json({});
  }
};
