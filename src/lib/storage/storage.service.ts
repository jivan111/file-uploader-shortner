import { Injectable } from '@nestjs/common';

import { IStorage } from './storage.interface';
import { S3Service } from './s3.service';

@Injectable()
export class StorageService implements IStorage {
  constructor(private storage: S3Service) {}

  uploadPresignedUrl(
    bucket: string,
    key: string,
    contentType: string,
    expiresIn?: number,
  ): Promise<string> {
    return this.storage.uploadPresignedUrl(bucket, key, contentType, expiresIn);
  }

  getPresignedUrl(
    bucket: string,
    key: string,
    expiresIn?: number,
  ): Promise<string> {
    return this.storage.getPresignedUrl(bucket, key, expiresIn);
  }
}
