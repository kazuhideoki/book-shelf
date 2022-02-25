/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../server/helper/api-helper";
import { DriveFileService } from "../../../server/service/drive-file-service";
import { ListDriveFiles } from "../../../type/api/google-drive-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { q, pageSize, pageToken, mimeType } = api.query as ListDriveFiles &
        any;

      // const response = await api
      //   .daxiosRequest<DriveFiles>("GET", ExternalPath.files, {
      //     params: {
      //       q,
      //       mimeType,
      //       pageSize: pageSize ?? 10,
      //       pageToken,
      //     },
      //   })
      const response = await new DriveFileService(api.appUser)
        .list({
          q,
          pageSize,
          pageToken,
        })
        .catch((e) => console.log(`error daxios files ${e}`));

      res.status(200).json(response);
    },
  });
};
