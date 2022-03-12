import { Module } from '@nestjs/common';
import { DisplaySetsService } from './display-sets.service';
import { DisplaySetsController } from './display-sets.controller';

@Module({
  controllers: [DisplaySetsController],
  providers: [DisplaySetsService]
})
export class DisplaySetsModule {}
