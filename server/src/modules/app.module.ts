import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingServerFirebase } from '../0-base/setting-server-firebase';
import { AccountRepository } from '../1-repositories/account.repository';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { ImageSetRepository } from '../1-repositories/image-set.repository';
import { StorageRepository } from '../1-repositories/storage-repository';
import { FileService } from '../2-services/file.service';
import { DisplaySetController } from '../3-controllers/display-set.controller';
import { FileController } from '../3-controllers/file.controller';
import { SelfController } from '../3-controllers/self.controller';
import { BaseModule } from './base.module';
import { RepositoryModule } from './repository.module';
import { ServiceModule } from './service.module';

console.log('app.module.ts');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServiceModule,
    RepositoryModule,
    BaseModule,
  ],
  controllers: [DisplaySetController, FileController, SelfController],
  providers: [
    AccountRepository,
    DisplaySetRepository,
    DriveFileRepository,
    ImageSetRepository,
    StorageRepository,
    SettingServerFirebase,
    FileService,
  ],
})
export class AppModule {}
