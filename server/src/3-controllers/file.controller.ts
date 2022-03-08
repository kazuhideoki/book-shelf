import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ImageSet } from '../../../type/model/firestore-image-set.type';
import { DriveFiles } from '../../../type/model/google-drive-file.type';
import { DriveFileService } from '../1-repositories/drive-file-service';

@Controller('files')
export class AppController {
  constructor(private readonly driveFileService: DriveFileService) {}

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

  @Post(':id')
  registerDisplaySet(@Param('id ') id: string): Promise<ImageSet> {
    // return this.driveFileService.hoge
  }
}
