import { IsNotEmpty, IsString } from 'class-validator';
import { GetSignedUrlParams } from '../interfaces';

export class GetPreSignedUrlDto implements GetSignedUrlParams {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsNotEmpty()
  @IsString()
  contentLength: string;
}
