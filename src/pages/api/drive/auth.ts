/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../server/helper/api-helper";
import { getAuthUrl } from "../../../utils/get-auth-url";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const url = getAuthUrl();
      res.json(url);
    },
  });
};
