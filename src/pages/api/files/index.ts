/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthResponse } from "../../../type/google-drive-api.type";
import { axiosRequest } from "../../../utils/axios";

const fileId = "1etL4N_wtxozkzGoKcMlmY_md0jGrDwmK";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { access_token, refresh_token } = req.query as AuthResponse;

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

    return res.status(200).json(response);
  }
};
