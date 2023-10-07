export interface IStorage {
  uploadPresignedUrl(
    bucket: string,
    key: string,
    contentType: string,
    expiresIn: number,
  ): Promise<string>;

  getPresignedUrl(
    bucket: string,
    key: string,
    expiresIn: number,
  ): Promise<string>;
}
