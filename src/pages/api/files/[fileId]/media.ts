/* eslint-disable import/no-anonymous-default-export */
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { bucket, collection } from "../../../../server/firebase-service";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { Path, StoragePath } from "../../../../server/helper/const";
import { ImageSet } from "../../../../type/firestore-image-set.type";
import { MediaType } from "../../../../type/google-drive-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { fileId, mediaType } = api.query;

      const imageSet = (
        await getDoc(doc(collection("ImageSets"), fileId))
      ).data() as ImageSet;

      if (imageSet) {
        console.log(`imageSet exists`);

        const response = await bucket.file(imageSet.path).download();

        console.log(`1 page of PDF downloaded from Firebase Storage`);

        const result = response[0].toString();

        return res.status(200).json(result);
      }
      console.log(`imageSet not found`);

      const response = await api.daxiosRequest<any>("GET", Path.file(fileId), {
        params: {
          alt: "media",
        },
        responseEncoding: "base64",
      });

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

      await setDoc(doc(collection("ImageSets"), fileId), data);

      if (mediaType === MediaType.IMAGE) {
        throw new Error("Not implemented");
      } else if (mediaType === MediaType.PDF || mediaType === undefined) {
        return res.status(200).json((result as any).toString("base64"));
      }
    },
  });
};
