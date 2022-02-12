/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { axiosRequest } from "../../../utils/axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("api/files");

  if (req.method === "GET") {
    const { access_token } = req.query;

    console.log({ access_token });

    const testFileId = "1-ENsqeRnlXLypgVzaVWvuTXFGQr1nYeh";

    // const response = await fetch(
    //   `https://www.googleapis.com/drive/v3/files/${testFileId}?access_token=${access_token}`
    // );
    const response: any = await axiosRequest(
      "GET",
      `https://www.googleapis.com/drive/v3/files/${testFileId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log({ response: response });

    return res.status(200).json({ files: [response] });
  }
};
