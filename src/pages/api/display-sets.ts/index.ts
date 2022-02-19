/* eslint-disable import/no-anonymous-default-export */
import { doc, setDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { collection } from "../../../server/firebase-service";
import { ApiHelper } from "../../../server/helper/api-helper";
import { DisplaySet } from "../../../type/model/firestore-display-set.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    post: async () => {
      const data = api.data;

      const ref = doc(collection("DisplaySets"));

      const firebaseData: DisplaySet = {
        userId: api.userId,
        displaySetId: ref.id,
        files: data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(ref, firebaseData);

      res.status(200).json(firebaseData);
    },
  });
};
