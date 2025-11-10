import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  TransformImageDto,
  ImageQuality,
  ImageFormat,
} from './dto/transform-image.dto';
import { TransformResponseDto } from './dto/transform-response.dto';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  private readonly uploadDir: string;
  private readonly geminiApiKey: string;
  private readonly geminiApiUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || 'uploads';
    this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.geminiApiUrl = this.configService.get<string>('GEMINI_API_URL');

    // Ensure upload directory exists
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    const uploadPath = path.join(process.cwd(), this.uploadDir);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      this.logger.log(`Created upload directory: ${uploadPath}`);
    }
  }

  async transformImage(
    dto: TransformImageDto,
  ): Promise<TransformResponseDto> {
    const startTime = Date.now();

    try {
      // Decode base64 image
      const imageBuffer = Buffer.from(dto.image, 'base64');
      const originalSize = imageBuffer.length;

      this.logger.log(
        `Processing image transformation. Original size: ${originalSize} bytes`,
      );

      // Call Gemini Nano Banana API
      const transformedImageBuffer = await this.callGeminiApi(
        imageBuffer,
        dto.prompt,
        dto.quality,
        dto.format,
      );

      // Generate unique filename
      const filename = this.generateFilename(dto.format);
      const filePath = path.join(this.uploadDir, filename);
      const absolutePath = path.join(process.cwd(), filePath);

      // Save transformed image
      fs.writeFileSync(absolutePath, transformedImageBuffer);

      const processingTime = Date.now() - startTime;
      const transformedSize = transformedImageBuffer.length;

      this.logger.log(
        `Image transformation completed in ${processingTime}ms. Saved to: ${filePath}`,
      );

      // Build response
      const response: TransformResponseDto = {
        success: true,
        filePath: `/${filePath}`,
        url: `http://localhost:3000/${filePath}`,
        metadata: {
          originalSize,
          transformedSize,
          format: dto.format,
          quality: dto.quality,
          prompt: dto.prompt,
          processingTimeMs: processingTime,
        },
      };

      return response;
    } catch (error) {
      this.logger.error(
        `Image transformation failed: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Image transformation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async callGeminiApi(
    imageBuffer: Buffer,
    prompt: string,
    quality: ImageQuality,
    format: ImageFormat,
  ): Promise<Buffer> {
    try {
      // Convert image buffer to base64 for API request
      const base64Image = imageBuffer.toString('base64');

      this.logger.log(
        `Calling Gemini Nano Banana API with prompt: "${prompt}"`,
      );

      // Make API request to Gemini Nano Banana
      const response = await axios.post(
        this.geminiApiUrl,
        {
          image: base64Image,
          prompt: prompt,
          quality: quality,
          output_format: format,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.geminiApiKey}`,
          },
          timeout: 60000, // 60 second timeout
        },
      );

      // Check response
      if (!response.data || !response.data.transformed_image) {
        throw new Error('Invalid response from Gemini API');
      }

      // Convert base64 response back to buffer
      const transformedImageBuffer = Buffer.from(
        response.data.transformed_image,
        'base64',
      );

      this.logger.log('Successfully received transformed image from Gemini API');

      return transformedImageBuffer;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        this.logger.error(
          `Gemini API request failed (${status}): ${message}`,
          error.stack,
        );
        throw new Error(`Gemini API error: ${message}`);
      }
      throw error;
    }
  }

  private generateFilename(format: ImageFormat): string {
    const timestamp = Date.now();
    const uuid = uuidv4();
    return `menu-photo-${timestamp}-${uuid}.${format}`;
  }
}
