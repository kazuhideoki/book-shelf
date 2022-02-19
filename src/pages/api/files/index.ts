/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../server/helper/api-helper";
import { Path } from "../../../server/helper/const";
import { ListDriveFiles } from "../../../type/api/google-drive-api.type";
import { DriveFiles } from "../../../type/model/google-drive.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { q, pageSize, pageToken, mimeType } = api.query as ListDriveFiles &
        any;

      const response = await api.daxiosRequest<DriveFiles>("GET", Path.files, {
        params: {
          q,
          mimeType,
          pageSize: pageSize ?? 10,
          pageToken,
        },
      });

      res.status(200).json(response);
    },
  });
};
