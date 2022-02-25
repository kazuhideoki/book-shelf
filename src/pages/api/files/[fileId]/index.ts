/* eslint-disable import/no-anonymous-default-export */
import { DateTime } from "luxon";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { convertPDFToImage } from "../../../../server/service/convert-pdf-to-image";
import { DriveFileService } from "../../../../server/service/drive-file-service";
import { ImageSetService } from "../../../../server/service/image-set.service";
import { StorageService } from "../../../../server/service/storage-service";
import { ImageSet } from "../../../../type/model/firestore-image-set.type";

const expiryTime = 60 * 60 * 24 * 7;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new ApiHelper(req, res);

  return api.handler({
    get: async () => {
      const { fileId } = api.query;

      const imageSet = await new ImageSetService(api.appUser).find(fileId);

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

      const media = await new DriveFileService(api.appUser).fetchMedia(fileId);

      console.log(`PDF downloaded from Google Drive`);

      const image = await convertPDFToImage(fileId, media);

      await new StorageService(api.appUser).save(fileId, image);

      const expires = DateTime.fromJSDate(new Date())
        .plus({
          seconds: expiryTime,
        })
        .toJSDate();
      const url = await new StorageService(api.appUser).getSignedUrl(
        fileId,
        expires
      );

      const data: ImageSet = {
        userId: api.userId,
        fileId,
        path: url,
        expiredAt: expires,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await new ImageSetService(api.appUser).register(fileId, data);
      console.log(`cache path saved in Firestore`);

      return res.status(200).json(data);
    },
  });
};
