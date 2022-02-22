/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { collection } from "../../../server/firebase-service";
import { ApiHelper } from "../../../server/helper/api-helper";
import { RegisterAppUser } from "../../../type/api/firestore-user-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    post: async () => {
      const userId = api.userId;
      const data = api.data as RegisterAppUser;

      await collection("users").doc(userId).create(data);

      res.status(200).json(data);
    },
  });
};
