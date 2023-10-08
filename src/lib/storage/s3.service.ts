import { Injectable } from '@nestjs/common';
import { IStorage } from './storage.interface';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
@Injectable()
export class S3Service implements IStorage {
  private s3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-2',
    });
  }

  async uploadPresignedUrl(
    bucket: string,
    key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      ContentType: contentType,
      Key: key,
      ACL: 'public-read',
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return url;
  }

  async getPresignedUrl(
    bucket: string,
    key: string,
    expiresIn = 10800,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return url;
  }
}
