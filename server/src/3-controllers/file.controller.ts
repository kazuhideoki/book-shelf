import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ImageSet } from '../../../type/model/firestore-image-set.type';
import { DriveFiles } from '../../../type/model/google-drive-file.type';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { FileService } from '../2-services/file.service';

@Controller('files')
export class FileController {
  constructor(
    private readonly driveFileService: DriveFileRepository,
    private readonly fileService: FileService,
  ) {}

  @Get()
  getFiles(
    @Query() pageSize?: number,
    @Query() q?: string,
    @Query() pageToken?: string,
  ): Promise<DriveFiles> {
    return this.driveFileService.list({
      pageSize: pageSize ?? 10,
      q,
      pageToken,
    });
  }

  @Post(':fileId')
  registerDisplaySet(@Param('fileId ') fileId: string): Promise<ImageSet> {
    return this.fileService.findImageSet(fileId);
  }
}
