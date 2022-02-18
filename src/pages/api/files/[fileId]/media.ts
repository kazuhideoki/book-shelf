/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { bucket } from "../../../../server/firebase-service";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { Path } from "../../../../server/helper/const";
import { MediaType } from "../../../../type/google-drive-api.type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { fileId, mediaType } = api.query;

      const response = await api.daxiosRequest<string>(
        "GET",
        Path.file(fileId),
        {
          params: {
            alt: "media",
          },
          // responseEncoding: "base64",
        }
      );

      // const pdfDoc = await PDFDocument.load(response);
      // const firstPage = pdfDoc.getPages()[0];
      // const result = await firstPage.doc.saveAsBase64();

      console.log("1");

      await bucket
        .file(`files/${api.userId}/${fileId}.pdf`)
        .save(response)
        .catch((e) => console.log(`3 ${e}`));

      console.log("2");

      if (mediaType === MediaType.IMAGE) {
        throw new Error("Not implemented");
      } else if (mediaType === MediaType.PDF || mediaType === undefined) {
        return res.status(200).json({});
      }
    },
  });
};
