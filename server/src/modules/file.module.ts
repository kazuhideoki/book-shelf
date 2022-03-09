import { Module, Scope } from '@nestjs/common';
import { AuthContext } from '../0-base/auth-context';
import { AccountRepository } from '../1-repositories/account.repository';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { ImageSetRepository } from '../1-repositories/image-set.repository';
import { StorageRepository } from '../1-repositories/storage-repository';
import { FileService } from '../2-services/file.service';
import { FileController } from '../3-controllers/file.controller';

@Module({
  controllers: [FileController],
  providers: [
    AccountRepository,
    DriveFileRepository,
    ImageSetRepository,
    StorageRepository,
    FileService,
    AuthContext,
    {
      provide: 'AUTH_CONTEXT_INIT',
      useValue: {},
      scope: Scope.REQUEST,
    },
  ],
  // exports: [FileController],
})
export class FileModule {}
