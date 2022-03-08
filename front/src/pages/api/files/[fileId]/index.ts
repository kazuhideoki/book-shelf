/* eslint-disable import/no-anonymous-default-export */
import { writeFileSync } from "fs";
import { DateTime } from "luxon";
import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import PdfParse from "pdf-parse";
import { ImageSetRepository } from "../../../../../../server/src/1-repositories/image-set.repository";
import { StorageRepository } from "../../../../../../server/src/1-repositories/storage-service";
import { ApiHelper } from "../../../../old-server/helper/api-helper";
import { AuthContext } from "../../../../old-server/helper/auth-context";
import { convertPDFToImage } from "../../../../old-server/service/convert-pdf-to-image";
import { DriveFileService } from "../../../../old-server/service/drive-file-service";
import {
  ImageSet,
  ImageSetMeta,
} from "../../../../type/model/firestore-image-set.type";

const expiryTime = 60 * 60 * 24 * 7;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { fileId } = api.query;

      const imageSet = await new ImageSetRepository(AuthContext.instance).find(
        fileId
      );

      if (
        imageSet &&
        DateTime.now() < DateTime.fromJSDate(imageSet.expiredAt)
      ) {
        // TODO Drive側で更新されていたら取得し直す処理も必要
        console.log(`imageSet exists and not expired`);

        return res.status(200).json(imageSet);
      }

      if (!imageSet) console.log(`imageSet not found`);
      if (
        imageSet &&
        !(DateTime.now() < DateTime.fromJSDate(imageSet.expiredAt))
      )
        console.log(`imageSet not found`);

      const media = await new DriveFileService(AuthContext.instance).fetchMedia(
        fileId
      );
      console.log({ media });

      writeFileSync(`./tmp/${fileId}.pdf`, Buffer.from(media));

      const parseResult = await PdfParse(Buffer.from(media)); // 文字、メタデータなど取れる。注釈は取れない。。。

      const base64 = Buffer.from(media).toString("base64");
      const page = (await PDFDocument.load(base64)).getPage(0);

      const width = page.getWidth();
      const height = page.getHeight();

      console.log({ width, height });

      console.log(`PDF downloaded from Google Drive`);

      const image = await convertPDFToImage(fileId, base64, {
        width,
        height,
      });

      await new StorageRepository(AuthContext.instance).save(fileId, image);

      const expires = DateTime.fromJSDate(new Date())
        .plus({
          seconds: expiryTime,
        })
        .toJSDate();
      const url = await new StorageRepository(
        AuthContext.instance
      ).getSignedUrl(fileId, expires);

      const meta: ImageSetMeta = {
        pages: parseResult.numpages,
      };

      if (parseResult.info.Title) meta.title = parseResult.info.Title;

      const data: ImageSet = {
        accountId: AuthContext.instance.auth.accountId,
        fileId,
        path: url,
        meta: meta,
        expiredAt: expires,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await new ImageSetRepository(AuthContext.instance).register(fileId, data);
      console.log(`cache path saved in Firestore`);

      return res.status(200).json(data);
    },
  });
};
