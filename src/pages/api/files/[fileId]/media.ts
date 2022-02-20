/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
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

        const response = await bucket.file(imageSet.path).download();

        console.log(`1 page of PDF downloaded from Firebase Storage`);

        const result = response[0].toString();

        return res.status(200).json(result);
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

      const pdfDoc = await PDFDocument.load(response);
      const firstPage = pdfDoc.getPages()[0];
      const result = await firstPage.doc.saveAsBase64();

      await bucket.file(StoragePath.pdfFile(api.userId, fileId)).save(result);

      console.log(`1 page of PDF saved in Firebase Storage`);

      const data: ImageSet = {
        userId: api.userId,
        fileId,
        path: StoragePath.pdfFile(api.userId, fileId),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await firestore.collection("ImageSets").doc(fileId).create(data);
      // await setDoc(doc(collection("ImageSets"), fileId), data);
      console.log(`cache path saved in Firestore`);

      if (mediaType === MediaType.IMAGE) {
        throw new Error("Not implemented");
      } else if (mediaType === MediaType.PDF || mediaType === undefined) {
        return res.status(200).json((result as any).toString("base64"));
      }
    },
  });
};
