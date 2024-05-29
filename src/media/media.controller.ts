import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetPreSignedUrlDto } from './dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('/get-pre-signed-url')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  async uploadMedia(@Body() getPreSignedUrlDto: GetPreSignedUrlDto) {
    return this.mediaService.getPreSignedUrl(getPreSignedUrlDto);
  }
}
