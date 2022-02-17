/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { MediaType } from "../../../../../type/google-drive-api.type";
import { daxiosRequest } from "../../../../../utils/axios-drive";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { access_token } = req.headers;
    const { fileId, mediaType } = req.query as any;

    const response = await daxiosRequest<string>(
      "GET",
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      access_token as string,
      {
        responseEncoding: "base64",
      }
    );

    const pdfDoc = await PDFDocument.load(response);
    const firstPage = pdfDoc.getPages()[0];
    const result = await firstPage.doc.saveAsBase64();

    if (mediaType === MediaType.IMAGE) {
      throw new Error("Not implemented");
    } else if (mediaType === MediaType.PDF || mediaType === undefined) {
      return res.status(200).json(result);
    }
  }
};
