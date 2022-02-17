/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ServerDriveService } from "../../../server/google-drive.service";
import { GetAccessToken } from "../../../type/google-drive-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { code } = req.query as GetAccessToken;

    let response;
    try {
      response = await ServerDriveService.getAccessToken(code);
    } catch (e) {
      console.log({ e });
    }

    res.json(response);
  }
};
