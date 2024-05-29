import { Inject, Injectable } from '@nestjs/common';
import { GetSignedUrlParams, PresignedUrlProvider } from './interfaces';
import { PRESIGNED_URL_PROVIDER_TOKEN } from './constants';

@Injectable()
export class MediaService {
  constructor(
    @Inject(PRESIGNED_URL_PROVIDER_TOKEN)
    private readonly presignedUrlProvider: PresignedUrlProvider,
  ) {}

  async getPreSignedUrl(signedUrlParams: GetSignedUrlParams) {
    return this.presignedUrlProvider.generatePresignedUrl(signedUrlParams);
  }
}
