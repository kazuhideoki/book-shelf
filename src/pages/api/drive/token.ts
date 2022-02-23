/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { DriveAuth } from "../../../recoil/atom/drive-auth";
import { collection } from "../../../server/firebase-service";
import { ApiHelper } from "../../../server/helper/api-helper";
import { ExternalPath } from "../../../server/helper/const";
import { HttpsError } from "../../../server/helper/https-error";
import { axiosRequest } from "../../../utils/axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { code } = api.query;
      const userId = api.userId;

      if (!api.query.userAuth) {
        throw new HttpsError("invalid-argument", `userAuth is Empty`);
      }

      const userAuth = JSON.parse(api.query.userAuth);

      console.log({ userAuth });

      const data = {
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID,
        client_secret: process.env.GOOGLE_DRIVE_API_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_WEB_SERVICE_URL,
        grant_type: "authorization_code",
      };

      console.log({ data });

      const response = await axiosRequest<DriveAuth>(
        "POST",
        ExternalPath.googleapiToken,
        {
          data,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`response in teken.ts`);
      console.log({ response });

      await collection("users").doc(userId).set({
        id: userId,
        userAuth,
        DriveAuth: response,
      });

      res.json({ response });
    },
  });
};
