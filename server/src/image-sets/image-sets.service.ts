import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { DateTime } from 'luxon';
import { PDFDocument } from 'pdf-lib';
import { AuthContext } from '../0-base/auth-context';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { ImageSetRepository } from '../1-repositories/image-set.repository';
import { StorageRepository } from '../1-repositories/storage-repository';
import { convertPDFToImage } from '../2-services/helper/convert-pdf-to-image';
import { CreateImageSetDto } from './dto/create-image-set.dto';
import { UpdateImageSetDto } from './dto/update-image-set.dto';
import { ImageSet, ImageSetMeta } from './entities/image-set.entity';

const expiryTime = 60 * 60 * 24 * 7; // 1 week

@Injectable()
export class ImageSetsService {
  constructor(
    private readonly authContext: AuthContext,
    private readonly imageSetRepository: ImageSetRepository,
    private readonly driveFileRepository: DriveFileRepository,
    private readonly storageRepository: StorageRepository,
  ) {}

  create(createImageSetDto: CreateImageSetDto) {
    return 'This action adds a new imageSet';
  }

  findAll() {
    return `This action returns all imageSets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageSet`;
  }

  async findImageSet(fileId: string): Promise<ImageSet> {
    const imageSet = await this.imageSetRepository.find(fileId);

    if (imageSet && DateTime.now() < DateTime.fromJSDate(imageSet.expiredAt)) {
      // TODO Drive側で更新されていたら取得し直す処理も必要
      console.log(`imageSet exists and not expired`);

      return imageSet;
    }

    if (
      !imageSet ||
      !(DateTime.now() < DateTime.fromJSDate(imageSet.expiredAt))
    )
      console.log(`imageSet not found`);

    const media = await this.driveFileRepository.fetchMedia(
      fileId,
      this.authContext.auth.accessToken,
    );
    console.log({ media });

    const buf = Buffer.from(media);
    writeFileSync(`./tmp/${fileId}.pdf`, buf);

    // const parseResult = await PdfParse(buf); // 文字、メタデータなど取れる。注釈は取れない。。。

    const base64 = buf.toString('base64');

    const doc = await PDFDocument.load(base64);
    const pages = doc.getPages().length;
    const page = doc.getPage(0);

    const width = page.getWidth();
    const height = page.getHeight();

    console.log({ width, height });

    console.log(`PDF downloaded from Google Drive`);

    const image = await convertPDFToImage(fileId, base64, {
      width,
      height,
    });

    await this.storageRepository.save(fileId, image);

    const expires = DateTime.fromJSDate(new Date())
      .plus({
        seconds: expiryTime,
      })
      .toJSDate();
    const url = await this.storageRepository.getSignedUrl(fileId, expires);

    const meta: ImageSetMeta = {
      // pages: parseResult.numpages,555
      pages,
    };

    // if (parseResult.info.Title) meta.title = parseResult.info.Title;

    const data: ImageSet = {
      accountId: this.authContext.auth.accountId,
      fileId,
      path: url,
      meta: meta,
      expiredAt: expires,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log({ data });

    await this.imageSetRepository.register(fileId, data);
    console.log(`cache path saved in Firestore`);

    return data;
  }

  update(id: number, updateImageSetDto: UpdateImageSetDto) {
    return `This action updates a #${id} imageSet`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageSet`;
  }
}
