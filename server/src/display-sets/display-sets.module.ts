import { Module } from '@nestjs/common';
import { DisplaySetsController } from './display-sets.controller';
import { DisplaySetsService } from './display-sets.service';

@Module({
  controllers: [DisplaySetsController],
  providers: [DisplaySetsService],
})
export class DisplaySetsModule {}
