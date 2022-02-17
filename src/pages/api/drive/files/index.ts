/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { DriveFiles } from "../../../../type/google-drive-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apiHelper = new ApiHelper(req, res);

  apiHelper.handler({
    get: async () => {
      const response = await apiHelper.daxiosRequest<DriveFiles>(
        "GET",
        `https://www.googleapis.com/drive/v3/files/`,
        {
          params: {
            q: "mimeType='application/pdf'",
            pageSize: 10,
          },
        }
      );

      return res.status(200).json(response);
    },
  });
};
