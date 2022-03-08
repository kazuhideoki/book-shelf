/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../old-server/helper/api-helper";
import { AuthContext } from "../../../old-server/helper/auth-context";
import { DisplaySetService } from "../../../old-server/service/display-set.service";
import { RegisterDispalySet } from "../../../type/api/firestore-display-set-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      try {
        const response = await new DisplaySetService(
          AuthContext.instance
        ).list();

        res.status(200).json(response);
      } catch (error) {
        res.status(500).json(error);
      }
    },
    post: async () => {
      const data = api.data as RegisterDispalySet;

      const response = await new DisplaySetService(
        AuthContext.instance
      ).register(data);

      res.status(200).json(response);
    },
  });
};
