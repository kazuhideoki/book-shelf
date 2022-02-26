/* eslint-disable import/no-anonymous-default-export */
import { OAuth2Client } from "google-auth-library";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../server/helper/api-helper";
import { AuthContext } from "../../server/helper/auth-context";

const client = new OAuth2Client(process.env.CLIENT_ID);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    post: async () => {
      const account = AuthContext.instance.account;
      return res.json(account);
    },
  });
};
