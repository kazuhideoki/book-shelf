/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { DriveAuth } from "../../../recoil/atom/drive-auth";
import { ApiHelper } from "../../../server/helper/api-helper";
import { Path } from "../../../server/helper/const";
import { GetAccessToken } from "../../../type/google-drive-api.type";
import { axiosRequest } from "../../../utils/axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { code } = api.query<GetAccessToken>();

      const data = {
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID,
        client_secret: process.env.GOOGLE_DRIVE_API_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_WEB_SERVICE_URL,
        grant_type: "authorization_code",
      };

      const response = await axiosRequest<DriveAuth>(
        "POST",
        Path.googleapiToken,
        {
          data,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response);
    },
  });
};
