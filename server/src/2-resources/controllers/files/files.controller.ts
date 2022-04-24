import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ListDriveFiles } from '../../../type/api/google-drive-api.dto';
import { DriveFiles } from '../../../type/model/google-drive-file.dto';
import { AuthGuard } from '../../guards/auth-guard';
import { FilesService } from './files.service';

@Controller('files')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Post()
  // create(@Body() createFileDto: CreateFileDto) {
  //   return this.filesService.create(createFileDto);
  // }

  @Get()
  getFiles(
    @Query()
    { pageSize, q, pageToken }: ListDriveFiles,
  ): Promise<DriveFiles> {
    return this.filesService.findAll({
      pageSize: pageSize ?? 10,
      q,
      pageToken,
    });
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.filesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.filesService.update(+id, updateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
