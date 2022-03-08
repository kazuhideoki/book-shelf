import { Module } from '@nestjs/common';
import { FileService } from './2-services/file.service';
import { DisplaySetController } from './3-controllers/display-set.controller';
import { FileController } from './3-controllers/file.controller';
import { SelfController } from './3-controllers/self.controller';

@Module({
  imports: [],
  controllers: [DisplaySetController, FileController, SelfController],
  providers: [FileService],
})
export class AppModule {}
