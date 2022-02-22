/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { collection, toData } from "../../../../server/firebase-service";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { AppUser } from "../../../../type/model/firestore-user.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const userId = api.userId;

      const user = await toData<AppUser>(collection("users").doc(userId).get());

      res.status(200).json(user);
    },
  });
};
