import { Injectable } from '@nestjs/common';
import { AuthContext } from '../../../0-base/auth-context';
import { DriveFileRepository } from '../../../1-repositories/drive-file-repository';
import { ListDriveFiles } from '../../../type/api/google-drive-api.type';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

const expiryTime = 60 * 60 * 24 * 7; // 1 week

@Injectable()
export class FilesService {
  constructor(
    private readonly driveFileRepository: DriveFileRepository,
    private readonly authContext: AuthContext,
  ) {}

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll(q: ListDriveFiles) {
    return this.driveFileRepository.list(q, this.authContext.auth.accessToken);
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
