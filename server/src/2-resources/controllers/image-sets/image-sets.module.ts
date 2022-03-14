import { Module } from '@nestjs/common';
import { DriveFileRepository } from '../../../1-repositories/drive-file-repository';
import { ImageSetRepository } from '../../../1-repositories/image-set.repository';
import { StorageRepository } from '../../../1-repositories/storage-repository';
import { ImageSetsController } from './image-sets.controller';
import { ImageSetsService } from './image-sets.service';

@Module({
  controllers: [ImageSetsController],
  providers: [
    ImageSetsService,
    ImageSetRepository,
    DriveFileRepository,
    StorageRepository,
  ],
})
export class ImageSetsModule {}
