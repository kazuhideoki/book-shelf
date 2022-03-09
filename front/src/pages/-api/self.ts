/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthContext } from "../../../../server/src/0-base/auth-context";
import { ApiHelper } from "../../old-server/helper/api-helper";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    post: async () => {
      const account = AuthContext.instance.auth;
      return res.json(account);
    },
  });
};
