import { Module } from '@nestjs/common';
import { SelfController } from './self.controller';

@Module({
  controllers: [SelfController],
  providers: [],
})
export class SelfModule {}
