import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as path from 'path';
import { UploadConst, UploadImageType } from 'src/constant/upload';
import { UploadFileDto, UploadImageDto } from 'src/dto/upload-dto/upload-file-dto';
import { Upload } from 'src/entities/upload/upload.entity';
import { S3Storage } from 'src/utils/s3-storage';
import { DataSource } from 'typeorm';

@Injectable()
export class UploadService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  getFilePath = (type: UploadImageType, fileName: string) => {
    switch (type) {
      case UploadImageType.USER_AVATAR:
        return `${UploadConst.dirUserAvatar}/${fileName}`;
      case UploadImageType.USER_COVER_IMAGE:
        return `${UploadConst.dirUserCover}/${fileName}`;
      default:
        return '';
    }
  };

  uploadFile = async (
    creatorId: number,
    body: UploadFileDto | UploadImageDto | any,
    file: Express.Multer.File,
    isPublic = true,
  ) => {
    const extName = path.extname(file.originalname);
    const uploadName = path.parse(file.originalname).name.replace(/\s+/g, '_');
    const randName = `${Date.now()}${Math.random().toString().substring(2, 8)}`;
    const fileName = `${uploadName}-${randName}${extName}`;
    const pathImage = this.getFilePath(body.type, fileName);
    await Upload.save({ path: pathImage, creatorId });
    const s3 = new S3Storage();
    await s3.upload({ buffer: file.buffer, s3path: pathImage, ContentType: file.mimetype, isPublic });
    return pathImage;
  };

  uploadImage = async (creatorId: number, body: UploadImageDto, image: Express.Multer.File) => {
    return await this.uploadFile(creatorId, body, image);
  };
}
