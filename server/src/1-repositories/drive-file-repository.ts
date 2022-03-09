import { Injectable, Scope } from '@nestjs/common';
import { BaseQuery } from '../../../front/src/utils/base-query';
import { ExternalPath } from '../../../front/src/utils/const';
import { DriveFiles } from '../../../type/model/google-drive-file.type';
import { daxiosRequest } from './helper.ts/request-to-drive';

export type DriveFileQuery = {
  q?: string;
  pageToken?: string;
} & BaseQuery;

@Injectable({ scope: Scope.REQUEST })
export class DriveFileRepository {
  async list(
    { q, pageToken, pageSize, orderBy }: DriveFileQuery,
    accessToken: string,
  ): Promise<DriveFiles> {
    const response = await daxiosRequest<DriveFiles>(
      'GET',
      ExternalPath.files,
      accessToken,
      {
        params: {
          pageSize,
          orderBy: orderBy?.join(','),
          q,
          pageToken,
        },
      },
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async fetchMedia(fileId: string, accessToken: string): Promise<Buffer> {
    return await daxiosRequest<Buffer>(
      'GET',
      ExternalPath.file(fileId),
      accessToken,
      {
        params: {
          alt: 'media',
        },
        responseType: 'arraybuffer',
      },
    );
  }

  async fetchMediaBase64(fileId: string, accessToken: string): Promise<string> {
    return await daxiosRequest<string>(
      'GET',
      ExternalPath.file(fileId),
      accessToken,
      {
        params: {
          alt: 'media',
        },
        responseEncoding: 'base64',
      },
    );
  }
}
