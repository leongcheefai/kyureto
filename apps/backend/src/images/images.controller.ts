import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { TransformImageDto } from './dto/transform-image.dto';
import { TransformResponseDto } from './dto/transform-response.dto';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('transform')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async transformImage(
    @Body() transformImageDto: TransformImageDto,
  ): Promise<TransformResponseDto> {
    return await this.imagesService.transformImage(transformImageDto);
  }
}
