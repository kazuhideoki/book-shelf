import {
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { ImageSet } from '../../../type/model/firestore-image-set.type';
import { DriveFiles } from '../../../type/model/google-drive-file.type';
import { NewAuthContext } from '../0-base/new-auth-context';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { FileService } from '../2-services/file.service';
import { AuthGuard } from '../security/authentication';

@Controller('files')
@Injectable({ scope: Scope.REQUEST })
@UseGuards(AuthGuard)
export class FileController {
  constructor(
    private readonly driveFileService: DriveFileRepository,
    private readonly fileService: FileService,
    private readonly authContext: NewAuthContext,
  ) {}

  @Get()
  getFiles(
    @Query() pageSize?: number,
    @Query() q?: string,
    @Query() pageToken?: string,
  ): Promise<DriveFiles> {
    return this.driveFileService.list(
      {
        pageSize: pageSize ?? 10,
        q,
        pageToken,
      },
      this.authContext.auth.accessToken,
    );
  }

  @Post(':fileId')
  registerDisplaySet(@Param('fileId ') fileId: string): Promise<ImageSet> {
    return this.fileService.findImageSet(fileId);
  }
}
