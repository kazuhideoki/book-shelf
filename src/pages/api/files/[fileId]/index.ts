/* eslint-disable import/no-anonymous-default-export */
import { readFileSync } from "fs";
import { DateTime } from "luxon";
import type { NextApiRequest, NextApiResponse } from "next";
import { fromBase64 } from "pdf2pic";
import { ApiHelper } from "../../../../server/helper/api-helper";
import { ExternalPath } from "../../../../server/helper/const";
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
      };

      const image = await fromBase64(
        response,
        options
      )(1).catch((e) => console.log(`error occurred in fromBase64: ${e}`));
      console.log({ imageResBase64: image });

      const imageData = readFileSync((image as any).path);

      await new StorageService(api.appUser).save(fileId, imageData);

      // bucket.file(StoragePath.imageFile(api.userId, fileId));

      const expires = DateTime.fromJSDate(new Date()).plus({
        seconds: expiryTime,
      });

      const url = await new StorageService(api.appUser).getSignedUrl(
        fileId,
        expires.toJSDate()
      );

      console.log({ url });

      const data: ImageSet = {
        userId: api.userId,
        fileId,
        path: url,
        expiredAt: expires.toJSDate(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await new ImageSetService(api.appUser).register(fileId, data);
      console.log(`cache path saved in Firestore`);

      return res.status(200).json(data);
    },
  });
};
