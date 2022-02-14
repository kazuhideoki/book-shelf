/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { axiosRequest } from "../../../../../utils/axios";
import { uint8ArrayToBase64 } from "../../../../../utils/base64ToArrayBuffer";

const fileId = "1etL4N_wtxozkzGoKcMlmY_md0jGrDwmK";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { access_token, fileId } = req.query as any;

    const response = await axiosRequest<string>(
      "GET",
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },

        responseEncoding: "base64",
      }
    );

    const pdfDoc = await PDFDocument.load(response);

    const firstPage = pdfDoc.getPages()[0];
    const result = await firstPage.doc.save();

    return res.status(200).json(uint8ArrayToBase64(result));
  }
};
