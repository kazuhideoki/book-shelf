/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../server/helper/api-helper";
import { DisplaySetService } from "../../../server/service/display-set.service";
import { RegisterDispalySet } from "../../../type/api/firestore-display-set-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);
  const userId = api.userId;

  return api.handler({
    get: async () => {
      try {
        const response = await new DisplaySetService(api.appUser).list();

        res.status(200).json(response);
      } catch (error) {
        res.status(500).json(error);
      }
    },
    post: async () => {
      const data = api.data as RegisterDispalySet;

      const response = await new DisplaySetService(api.appUser).register(data);

      res.status(200).json(response);
    },
  });
};
