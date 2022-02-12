/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { axiosRequest } from "../../../utils/axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("api/files");

  if (req.method === "GET") {
    const { access_token } = req.query;

    console.log({ access_token });

    const testFileId = "14y_If6OunynA-KMIYiTPGNldfZ3z8WEb";

    // const response = await fetch(
    //   `https://www.googleapis.com/drive/v3/files/${testFileId}?access_token=${access_token}`
    // );
    const response: any = await axiosRequest(
      "GET",
      `https://www.googleapis.com/drive/v3/files/${testFileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // const drive = google.drive({ version: "v3", auth: access_token as string });
    // console.log({ drive });

    // drive.files.list(
    //   {
    //     pageSize: 10,
    //     fields: testFileId,
    //   },
    //   (err: any, res: any) => {
    //     console.log({ resInList: res });

    //     if (err) return console.log("The API returned an error: " + err);
    //     const files = res.data.files;
    //     console.log({ files });

    //     if (files.length) {
    //       console.log("Files:");
    //       files.map((file: any) => {
    //         console.log(`${file.name} (${file.id})`);
    //       });
    //     } else {
    //       console.log("No files found.");
    //     }
    //   }
    // );

    console.log({ response: response });

    return res.status(200).json({ files: [response] });
  }
};
