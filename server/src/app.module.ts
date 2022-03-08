import { Module } from '@nestjs/common';
// import { FileService } from './2-services/file.service';
// import { DisplaySetController } from './3-controllers/display-set.controller';
// import { FileController } from './3-controllers/file.controller';
// import { SelfController } from './3-controllers/self.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  // controllers: [DisplaySetController, FileController, SelfController],
  // providers: [FileService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
