/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthResponse } from "../../../../recoil/atom/drive-auth";
import { DriveFiles } from "../../../../type/google-drive-api.type";
import { axiosRequest } from "../../../../utils/axios";

const fileId = "1etL4N_wtxozkzGoKcMlmY_md0jGrDwmK";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(`⭐ api/drive/files`);

  if (req.method === "GET") {
    const { access_token } = req.query as AuthResponse;

    console.log({ query: req.query });
    console.log({ access_token });

    try {
      const response = await axiosRequest<DriveFiles>(
        "GET",
        `https://www.googleapis.com/drive/v3/files/`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log({ response });

      return res.status(200).json(response);
    } catch (error) {
      console.log({ error });
      res.status(500);
      return res.end();
    }
    1;
  }
};
