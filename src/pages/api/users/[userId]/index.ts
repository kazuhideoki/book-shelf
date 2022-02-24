/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { collection, toData } from "../../../../server/service/server_firebase";
import { AppUser } from "../../../../type/model/firestore-user.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const userId = api.userId;

      try {
        const user = await toData<AppUser>(
          collection("users").doc(userId).get()
        ).catch((e) => {
          console.log({ e });

          console.log(`error occurred in fetch appUser: ${e}`);
        });

        console.log(`Fetched appUser: ${user}`);

        if (user) {
          return res.status(200).json(user);
        }

        res.end();
      } catch (error) {
        console.log({ error });

        res.status(500);
        res.end();
      }
    },
  });
};
