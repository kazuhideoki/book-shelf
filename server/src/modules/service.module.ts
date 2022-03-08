import { Module } from '@nestjs/common';
import { FileService } from '../2-services/file.service';

@Module({
  providers: [FileService],
})
export class ServiceModule {}
