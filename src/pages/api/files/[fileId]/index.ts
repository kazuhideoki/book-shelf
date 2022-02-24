/* eslint-disable import/no-anonymous-default-export */
import { firestore as firebaseFirestore } from "firebase-admin";
import { readFileSync } from "fs";
import { DateTime } from "luxon";
import type { NextApiRequest, NextApiResponse } from "next";
import { fromBase64 } from "pdf2pic";
import {
  bucket,
  collection,
  toData,
} from "../../../../server/firebase-service";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { ExternalPath, StoragePath } from "../../../../server/helper/const";
import {
  ImageSet,
  ImageSetFS,
} from "../../../../type/model/firestore-image-set.type";

const expiryTime = 60 * 60 * 24 * 7;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { fileId } = api.query;

      const imageSet = await toData<ImageSetFS>(
        collection("imageSets").doc(fileId).get()
      );

      console.log({ imageSet });
      console.log(DateTime.now().toString());

      if (
        imageSet &&
        DateTime.now() < DateTime.fromJSDate(imageSet.expiredAt.toDate())
      ) {
        // TODO Drive側で更新されていたら取得し直す処理も必要
        console.log(`imageSet exists and not expired`);

        return res.status(200).json(imageSet);
      }

      if (!imageSet) console.log(`imageSet not found`);
      if (
        imageSet &&
        !(DateTime.now() < DateTime.fromJSDate(imageSet.expiredAt.toDate()))
      )
        console.log(`imageSet not found`);

      const response = await api.daxiosRequest<any>(
        "GET",
        ExternalPath.file(fileId),
        {
          params: {
            alt: "media",
          },
          responseEncoding: "base64",
        }
      );

      console.log(`PDF downloaded from Google Drive`);

      const options = {
        density: 100,
        saveFilename: fileId,
        savePath: `./tmp`,
        format: "png",
        // width: 300,
        // height: 300,
      };

      const image = await fromBase64(
        response,
        options
      )(1).catch((e) => console.log(`error occurred in fromBase64: ${e}`));
      console.log({ imageResBase64: image });

      const imageData = readFileSync((image as any).path);

      await bucket
        .file(StoragePath.imageFile(api.userId, fileId))
        .save(imageData)
        .catch((e) => console.log(`error occurred in bucket.file: ${e}`));

      bucket.file(StoragePath.imageFile(api.userId, fileId));

      const expiredAt = DateTime.fromJSDate(new Date()).plus({
        seconds: expiryTime,
      });
      const url = (
        await bucket
          .file(StoragePath.imageFile(api.userId, fileId))
          .getSignedUrl({
            action: "read",
            expires: expiredAt.toISO(),
          })
          .catch((e) => {
            console.log(`error occurred in getSignedUrl: ${e}`);
            throw e;
          })
      )[0];

      console.log({ url });

      // console.log(`1 page of PDF saved in Firebase Storage`);

      const data: ImageSetFS = {
        userId: api.userId,
        fileId,
        path: url,
        expiredAt: firebaseFirestore.Timestamp.fromDate(expiredAt.toJSDate()),
        createdAt: firebaseFirestore.Timestamp.fromDate(new Date()),
        updatedAt: firebaseFirestore.Timestamp.fromDate(new Date()),
      };

      const returnData: ImageSet = {
        ...data,
        expiredAt: data.expiredAt.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.expiredAt.toDate(),
      };

      await collection("imageSets")
        .doc(fileId)
        .set(data)
        .catch((e) => console.log(`error occurred in firestore: ${e}`));
      console.log(`cache path saved in Firestore`);

      return res.status(200).json(returnData);
    },
  });
};
