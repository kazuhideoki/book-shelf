/* eslint-disable import/no-anonymous-default-export */
import { firestore as firebaseFirestore } from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { DriveAuth } from "../../../recoil/atom/drive-auth";
import { collection, toData } from "../../../server/firebase-service";
import { ApiHelper } from "../../../server/helper/api-helper";
import { ExternalPath } from "../../../server/helper/const";
import { HttpsError } from "../../../server/helper/https-error";
import { UpdateAppUser } from "../../../type/api/firestore-user-api.type";
import { AppUser } from "../../../type/model/firestore-user.type";
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

      const appUser = await toData<AppUser>(
        collection("users").doc(userId).get()
      );

      const isCreate = !appUser;

      const data = isCreate
        ? {
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID,
            client_secret: process.env.GOOGLE_DRIVE_API_CLIENT_SECRET,
            redirect_uri: process.env.NEXT_PUBLIC_WEB_SERVICE_URL,
            grant_type: "authorization_code",
          }
        : {
            client_id: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID,
            client_secret: process.env.GOOGLE_DRIVE_API_CLIENT_SECRET,
            refresh_token: appUser.driveAuth.refresh_token,
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

      const updates: UpdateAppUser = {
        userId,
        userAuth,
        driveAuth: response,
        createdAt: isCreate
          ? firebaseFirestore.Timestamp.fromDate(new Date())
          : undefined,
        updatedAt: firebaseFirestore.Timestamp.fromDate(new Date()),
      };

      await collection("users").doc(userId).set(updates);

      res.json({ response });
    },
  });
};
