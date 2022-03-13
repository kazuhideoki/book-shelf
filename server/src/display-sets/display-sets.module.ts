import { Module } from '@nestjs/common';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';
import { DisplaySetsController } from './display-sets.controller';
import { DisplaySetsService } from './display-sets.service';

@Module({
  controllers: [DisplaySetsController],
  providers: [DisplaySetsService, DisplaySetRepository],
})
export class DisplaySetsModule {}
