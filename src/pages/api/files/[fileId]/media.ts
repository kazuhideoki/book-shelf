/* eslint-disable import/no-anonymous-default-export */
import { readFileSync } from "fs";
import { DateTime } from "luxon";
import type { NextApiRequest, NextApiResponse } from "next";
import { fromBase64 } from "pdf2pic";
import { bucket, firestore } from "../../../../server/firebase-service";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { ExternalPath, StoragePath } from "../../../../server/helper/const";
import { MediaType } from "../../../../type/api/google-drive-api.type";
import { ImageSet } from "../../../../type/model/firestore-image-set.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { fileId, mediaType } = api.query;

      const imageSet = (await firestore
        .collection("ImageSets")
        .doc(fileId)
        .get()
        .then((dss) => dss.data())) as ImageSet;

      if (imageSet) {
        // TODO Drive側で更新されていたら取得し直す処理も必要
        console.log(`imageSet exists`);

        // const response = await bucket.file(imageSet.path).download();

        // console.log(`1 page of PDF downloaded from Firebase Storage`);

        // const result = response[0].toString();

        return res.status(200).json(imageSet);
      }
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

      // TODO できれば表紙は画像ファイルで格納したい 方法模索中
      console.log(`PDF downloaded from Google Drive`);

      const options = {
        density: 100,
        saveFilename: fileId,
        savePath: `/tmp`,
        format: "png",
        width: 300,
        height: 300,
      };
      // const imageRes = await fromBase64(response, options)(1);

      // console.log({ imageRes });
      const image = await fromBase64(
        response,
        options
      )(1).catch((e) => console.log(`error occurred in fromBase64: ${e}`));
      console.log({ imageResBase64: image });

      // writeFileSync(`/tmp/${fileId}.png`, image);

      // const pdfDoc = await PDFDocument.load(response);
      // const firstPage = pdfDoc.getPages()[0];
      // const result = await firstPage.doc.saveAsBase64();

      const imageData = readFileSync((image as any).path);

      await bucket
        .file(StoragePath.imageFile(api.userId, fileId))
        .save(imageData)
        .catch((e) => console.log(`error occurred in bucket.file: ${e}`));

      bucket.file(StoragePath.imageFile(api.userId, fileId));

      const url = (
        await bucket
          .file(StoragePath.imageFile(api.userId, fileId))
          .getSignedUrl({
            action: "read",
            expires: DateTime.fromJSDate(new Date())
              .plus({ seconds: 10 })
              .toISO(),
          })
          .catch((e) => {
            console.log(`error occurred in getSignedUrl: ${e}`);
            throw e;
          })
      )[0];

      console.log({ url });

      // https://firebasestorage.googleapis.com/v0/b/e-book-shelf-342006.appspot.com/o/files%2FyCCoBR6AWlWgJ7oLWBDuIy1FSXP2%2F1BToZULEcKkTsDZaMWRe3A2e3pa9jwLVY.png?alt=media&token=47759da9-5c5b-4d6a-a7a5-3fdde0e69235

      // https://firebasestorage.googleapis.com/v0/b/e-book-shelf-342006.appspot.com/o

      // console.log(`1 page of PDF saved in Firebase Storage`);

      const data: ImageSet = {
        userId: api.userId,
        fileId,

        // ⭐❌ ここでpathをフロントに返すが、参照しているstorageのpathをうまく設定できない
        // path: encodeURIComponent(
        //   `${process.env.FIREBASE_STORAGE_URL}/${StoragePath.imageFile(
        //     api.userId,
        //     fileId
        //   )}`
        // ),
        path: url,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await firestore
        .collection("ImageSets")
        .doc(fileId)
        .create(data)
        .catch((e) => console.log(`error occurred in firestore: ${e}`));
      console.log(`cache path saved in Firestore`);

      if (mediaType === MediaType.IMAGE) {
        throw new Error("Not implemented");
      } else if (mediaType === MediaType.PDF || mediaType === undefined) {
        return res.status(200).json(data);
        // return res.status(200).json((image as any).base64);
      }
    },
  });
};
