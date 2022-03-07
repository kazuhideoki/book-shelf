/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../server/helper/api-helper";
import { AuthContext } from "../../server/helper/auth-context";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    post: async () => {
      const account = AuthContext.instance.auth;
      return res.json(account);
    },
  });
};
