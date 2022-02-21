/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../../server/helper/api-helper";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);
  const userId = api.userId;

  return api.handler({
    get: async () => {
      try {
        // display-sets/{id}/files で storageからpdf表示ファイル取得できるようにする？？
        // 要検討

        res.status(200).json({});
      } catch (error) {}
    },
  });
};
