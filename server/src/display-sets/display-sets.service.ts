import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { AuthContext } from '../0-base/auth-context';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';
import { DisplaySet } from '../type/model/firestore-display-set.type';
import { CreateDisplaySetDto } from './dto/create-display-set.dto';
import { UpdateDisplaySetDto } from './dto/update-display-set.dto';

@Injectable()
export class DisplaySetsService {
  constructor(
    private readonly displaySetRepository: DisplaySetRepository,
    private readonly authContext: AuthContext,
  ) {}

  create(createDisplaySetDto: CreateDisplaySetDto) {
    const displaySet: DisplaySet = {
      accountId: this.authContext.auth.accountId,
      displaySetId: `dpset_${v4()}`,
      name: createDisplaySetDto.name,
      files: createDisplaySetDto.files,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.displaySetRepository.register(displaySet);
  }

  findAll() {
    return this.displaySetRepository.list({
      accountId: this.authContext.accountId,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} displaySet`;
  }

  update(id: number, updateDisplaySetDto: UpdateDisplaySetDto) {
    return `This action updates a #${id} displaySet`;
  }

  remove(id: number) {
    return `This action removes a #${id} displaySet`;
  }
}
