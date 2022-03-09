import {
  Controller,
  Get,
  Injectable,
  Param,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { ImageSet } from '../../../type/model/firestore-image-set.type';
import { DriveFiles } from '../../../type/model/google-drive-file.type';
import { AuthContext } from '../0-base/auth-context';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { FileService } from '../2-services/file.service';
import { AuthGuard } from '../security/auth-guard';

@Controller('files')
@Injectable({ scope: Scope.REQUEST })
@UseGuards(AuthGuard)
export class FileController {
  constructor(
    private readonly driveFileService: DriveFileRepository,
    private readonly fileService: FileService,
    private readonly authContext: AuthContext,
  ) {}

  @Get()
  getFiles(
    @Query()
    {
      pageSize,
      q,
      pageToken,
    }: {
      pageSize?: number;
      q?: string;
      pageToken?: string;
    },
  ): Promise<DriveFiles> {
    const d = {
      pageSize,
      q,
      pageToken,
    };
    return this.driveFileService.list(
      {
        pageSize: pageSize ?? 10,
        q,
        pageToken,
      },
      this.authContext.instance().auth.accessToken,
    );
  }

  @Get(':fileId')
  getFile(@Param('fileId') fileId: string): Promise<ImageSet> {
    return this.fileService.findImageSet(fileId);
  }
}
