/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../server/helper/api-helper";
import { AuthContext } from "../../../server/helper/auth-context";
import { DriveFileService } from "../../../server/service/drive-file-service";
import { ListDriveFiles } from "../../../type/api/google-drive-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { q, pageSize, pageToken } = api.query as ListDriveFiles & any;

      const response = await new DriveFileService(AuthContext.instance)
        .list({
          q,
          pageSize: pageSize ?? 10,
          pageToken,
        })
        .catch((e) => console.log(`error daxios files ${e}`));

      res.status(200).json(response);
    },
  });
};
