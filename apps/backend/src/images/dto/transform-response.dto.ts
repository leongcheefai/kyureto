export class TransformResponseDto {
  success: boolean;
  filePath: string;
  url: string;
  metadata: {
    originalSize?: number;
    transformedSize?: number;
    format: string;
    quality: string;
    prompt: string;
    processingTimeMs: number;
  };
}
