import { Module } from '@nestjs/common';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, DriveFileRepository],
})
export class FilesModule {}
