# Image Transformation API Usage Guide

## Endpoint

**POST** `/api/images/transform`

Transform food photos into menu-ready images using Gemini Nano Banana AI.

## Configuration

Before using the API, update the `.env` file with your Gemini Nano Banana API credentials:

```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_API_URL=https://api.gemini-nano-banana.example.com/v1/transform
```

## Request Format

```json
{
  "image": "base64EncodedImageString",
  "prompt": "professional food photography, bright lighting, appetizing",
  "quality": "high",
  "format": "jpeg"
}
```

### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `image` | string | Yes | - | Base64-encoded image string |
| `prompt` | string | No | "professional food photography, bright lighting, appetizing" | Style description for transformation |
| `quality` | enum | No | "high" | Image quality: "low", "medium", or "high" |
| `format` | enum | No | "jpeg" | Output format: "jpeg", "png", or "webp" |

## Response Format

```json
{
  "success": true,
  "filePath": "/uploads/menu-photo-1699123456789-abc123.jpg",
  "url": "http://localhost:3000/uploads/menu-photo-1699123456789-abc123.jpg",
  "metadata": {
    "originalSize": 245678,
    "transformedSize": 198432,
    "format": "jpeg",
    "quality": "high",
    "prompt": "professional food photography, bright lighting, appetizing",
    "processingTimeMs": 2456
  }
}
```

## Example Usage

### Using cURL

```bash
# First, convert your image to base64
BASE64_IMAGE=$(base64 -i path/to/your/food-photo.jpg)

# Make the API request
curl -X POST http://localhost:3000/api/images/transform \
  -H "Content-Type: application/json" \
  -d "{
    \"image\": \"$BASE64_IMAGE\",
    \"prompt\": \"professional restaurant menu photo, warm lighting\",
    \"quality\": \"high\",
    \"format\": \"jpeg\"
  }"
```

### Using JavaScript/Fetch

```javascript
async function transformImage(imageFile) {
  // Convert file to base64
  const reader = new FileReader();
  const base64Image = await new Promise((resolve) => {
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(imageFile);
  });

  // Make API request
  const response = await fetch('http://localhost:3000/api/images/transform', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
      prompt: 'professional food photography, bright lighting',
      quality: 'high',
      format: 'jpeg',
    }),
  });

  const result = await response.json();
  console.log('Transformed image URL:', result.url);
  return result;
}
```

### Using Python

```python
import requests
import base64

def transform_image(image_path):
    # Read and encode image
    with open(image_path, 'rb') as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    # Make API request
    response = requests.post(
        'http://localhost:3000/api/images/transform',
        json={
            'image': base64_image,
            'prompt': 'professional food photography, bright lighting',
            'quality': 'high',
            'format': 'jpeg'
        }
    )

    result = response.json()
    print(f"Transformed image URL: {result['url']}")
    return result

# Usage
transform_image('path/to/food-photo.jpg')
```

## Error Responses

### Invalid Base64 Image (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": ["image must be base64 encoded"],
  "error": "Bad Request"
}
```

### Gemini API Error (500 Internal Server Error)

```json
{
  "statusCode": 500,
  "message": "Image transformation failed: Gemini API error: Rate limit exceeded"
}
```

## Running the Server

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will run on `http://localhost:3000`.

## Accessing Transformed Images

Transformed images are:
- Stored locally in the `uploads/` directory
- Accessible via HTTP at `http://localhost:3000/uploads/{filename}`
- Returned in the response with both `filePath` and `url`

Example:
```
http://localhost:3000/uploads/menu-photo-1699123456789-abc123.jpg
```

## Notes

1. **API Key**: Make sure to configure valid Gemini Nano Banana API credentials in `.env`
2. **File Size**: Large base64 strings may hit request size limits. Consider setting appropriate limits in your server configuration
3. **CORS**: CORS is enabled by default for development. Adjust in `main.ts` for production
4. **Storage**: Images are stored permanently in the `uploads/` directory. Consider implementing cleanup logic for production
5. **Security**: Add authentication/authorization as needed for production use
