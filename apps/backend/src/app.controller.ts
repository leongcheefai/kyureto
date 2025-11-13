import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('generate-photos')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
      },
      fileFilter: (req, file, callback) => {
        // Accept images and PDFs
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype === 'application/pdf'
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image and PDF files are allowed'),
            false,
          );
        }
      },
    }),
  )
  async generatePhotos(
    @UploadedFile() file: Express.Multer.File,
    @Body('email') email: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    return this.appService.generatePhotos(file, email);
  }
}
