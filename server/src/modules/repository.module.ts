import { Module } from '@nestjs/common';
import { AccountRepository } from '../1-repositories/account.repository';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { ImageSetRepository } from '../1-repositories/image-set.repository';
import { StorageRepository } from '../1-repositories/storage-repository';

@Module({
  providers: [
    AccountRepository,
    DisplaySetRepository,
    DriveFileRepository,
    ImageSetRepository,
    StorageRepository,
  ],
})
export class RepositoryModule {}
