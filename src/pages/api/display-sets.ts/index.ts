/* eslint-disable import/no-anonymous-default-export */
import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { collection } from "../../../server/firebase-service";
import { ApiHelper } from "../../../server/helper/api-helper";
import { DisplaySet } from "../../../type/model/firestore-display-set.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);
  const userId = api.userId;

  return api.handler({
    get: async () => {
      try {
        const response = await getDocs(
          query(collection("DisplaySets"), where("userId", "==", userId))
        );

        // display-sets/{id}/files で storageからpdf表示ファイル取得できるようにする？？
        // 要検討

        res.status(200).json(response);
      } catch (error) {}
    },
    post: async () => {
      const data = api.data;
      const ref = doc(collection("DisplaySets"));

      const firebaseData: DisplaySet = {
        userId: userId,
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
