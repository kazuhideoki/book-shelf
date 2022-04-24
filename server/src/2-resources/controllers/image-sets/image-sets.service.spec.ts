import { Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthContext } from '../../../0-base/auth-context';
import { FirebaseSetting } from '../../../0-base/firebase-setting';
import { DriveFileRepository } from '../../../1-repositories/drive-file-repository';
import { ImageSetRepository } from '../../../1-repositories/image-set.repository';
import { StorageRepository } from '../../../1-repositories/storage-repository';
import { GlobalModule } from '../../../global.module';
import { ImageSetsService } from './image-sets.service';

describe('ImageSetsService', () => {
  let service: ImageSetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageSetsService,
        ImageSetRepository,
        DriveFileRepository,
        StorageRepository,
        ImageSetRepository,
        ConfigService,
        FirebaseSetting,
        {
          provide: 'AUTH_CONTEXT_INIT',
          useValue: {},
          scope: Scope.REQUEST,
        },
        AuthContext,
        GlobalModule,
      ],
    }).compile();

    service = module.get<ImageSetsService>(ImageSetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
