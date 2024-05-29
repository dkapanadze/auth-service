import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { GetSignedUrlParams } from './interfaces';
import { v4 as uuidv4 } from 'uuid';
import { MAX_IMAGE_SIZE } from './constants';
import { config } from 'dotenv';

@Injectable()
export class S3ProvidesService {
  constructor(
    @InjectAwsService(S3) private readonly s3service: S3,
    private readonly configService: ConfigService,
  ) {}

  async generatePresignedUrl(signedUrlParams: GetSignedUrlParams) {
    const { filename, fileType } = signedUrlParams;

    const mimeType = fileType.split('/')[1];
    const file = fileType.split('/')[0];
    const key = `avatar/${uuidv4()}-${filename}`;

    const size = MAX_IMAGE_SIZE;

    const bucketName = this.configService.get('BUCKET_NAME');
    console.log(bucketName, 'bucketName');
    const params = {
      Bucket: bucketName,
      Fields: {
        key: key,
      },
      Expires: 3600,
      ContentType: mimeType,
      Conditions: [['content-length-range', 0, size]],
    };

    return this.s3service.createPresignedPost(params);
  }
}

// "url": "https://s3.amazonaws.com/my-nest-project-44444",
// "fields": {
//     "key": "avatar/a1a5d98a-ec2d-4456-8784-9b83ddfebc3e-test.jpg",
//     "bucket": "my-nest-project-44444",
//     "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
//     "X-Amz-Credential": "AKIARRQAIGZFW2L2BU2F/20240523/us-east-1/s3/aws4_request",
//     "X-Amz-Date": "20240523T150726Z",
//     "Policy": "eyJleHBpcmF0aW9uIjoiMjAyNC0wNS0yM1QxNjowNzoyNloiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2MF0seyJhY2wiOiJwdWJsaWMtcmVhZCJ9LHsia2V5IjoiYXZhdGFyL2ExYTVkOThhLWVjMmQtNDQ1Ni04Nzg0LTliODNkZGZlYmMzZS10ZXN0LmpwZyJ9LHsiYnVja2V0IjoibXktbmVzdC1wcm9qZWN0LTQ0NDQ0In0seyJYLUFtei1BbGdvcml0aG0iOiJBV1M0LUhNQUMtU0hBMjU2In0seyJYLUFtei1DcmVkZW50aWFsIjoiQUtJQVJSUUFJR1pGVzJMMkJVMkYvMjAyNDA1MjMvdXMtZWFzdC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsiWC1BbXotRGF0ZSI6IjIwMjQwNTIzVDE1MDcyNloifV19",
//     "X-Amz-Signature": "4f103700c0b699f68c25772e87c4c2d79ae62f94e75e6136f571e59a96b3cfd4"
// }
