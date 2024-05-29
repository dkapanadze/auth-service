import { GetSignedUrlParams } from './signed-url-params.interface';

export interface PresignedUrlProvider {
  generatePresignedUrl(getSignedUrlParams: GetSignedUrlParams);
}
