/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { Path } from "../../../../server/helper/const";
import { DriveFiles } from "../../../../type/google-drive-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const response = await api.daxiosRequest<DriveFiles>("GET", Path.files, {
        params: {
          q: "mimeType='application/pdf'",
          pageSize: 10,
        },
      });

      res.status(200).json(response);
    },
  });
};
