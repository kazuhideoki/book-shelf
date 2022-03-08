import { BaseQuery } from '../../../front/src/server/helper/base-query';
import { ExternalPath } from '../../../front/src/server/helper/const';
import { DriveFiles } from '../../../type/model/google-drive-file.type';
import { BaseService } from '../2-services/base.service';

export type DriveFileQuery = {
  q?: string;
  pageToken?: string;
} & BaseQuery;

export class DriveFileService extends BaseService {
  async list({
    q,
    pageToken,
    pageSize,
    orderBy,
  }: DriveFileQuery): Promise<DriveFiles> {
    const response = await this.daxiosRequest<DriveFiles>(
      'GET',
      ExternalPath.files,
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

  async fetchMedia(fileId: string): Promise<Buffer> {
    return await this.daxiosRequest<Buffer>('GET', ExternalPath.file(fileId), {
      params: {
        alt: 'media',
      },
      responseType: 'arraybuffer',
    });
  }

  async fetchMediaBase64(fileId: string): Promise<string> {
    return await this.daxiosRequest<string>('GET', ExternalPath.file(fileId), {
      params: {
        alt: 'media',
      },
      responseEncoding: 'base64',
    });
  }
}
