/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { MediaType } from "../../../../../type/google-drive-api.type";
import { axiosRequest } from "../../../../../utils/axios";

const fileId = "1etL4N_wtxozkzGoKcMlmY_md0jGrDwmK";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { access_token, fileId, mediaType } = req.query as any;

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

    const result = await firstPage.doc.saveAsBase64();

    if (mediaType === MediaType.IMAGE) {
      // const files = fromBase64(result, {
      //   format: "png",
      //   width: 400,
      // })?.bulk?.(1, true);
      // console.log({ files });
      // writeFileSync("/files/base64-output.png", (files as any).base64);
      // const r = readFileSync("/files/base64-output.png");
      // console.log({ r });
      // return res.status(200).json(r.toString("base64"));
    } else if (mediaType === MediaType.PDF || mediaType === undefined) {
      return res.status(200).json(result);
    }
  }
};
