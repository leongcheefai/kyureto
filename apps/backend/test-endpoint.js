/**
 * Simple test script for the image transformation endpoint
 *
 * Usage:
 * 1. Start the backend server: npm run start:dev
 * 2. Run this script: node test-endpoint.js
 */

const fs = require('fs');
const path = require('path');

// Sample 1x1 pixel red JPEG image in base64 (for testing without a real image)
const SAMPLE_BASE64_IMAGE = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==';

async function testTransformEndpoint() {
  console.log('🧪 Testing Image Transformation Endpoint\n');

  try {
    // Use native fetch (available in Node.js 18+)
    const response = await fetch('http://localhost:3000/api/images/transform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: SAMPLE_BASE64_IMAGE,
        prompt: 'professional food photography, bright lighting, appetizing',
        quality: 'high',
        format: 'jpeg',
      }),
    });

    console.log(`📡 Response Status: ${response.status} ${response.statusText}\n`);

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success!\n');
      console.log('Response Data:');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n📷 Transformed image URL:', data.url);
      console.log('📁 File path:', data.filePath);
      console.log('⏱️  Processing time:', data.metadata.processingTimeMs, 'ms');
    } else {
      console.log('❌ Error!\n');
      console.log('Error Data:');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Request Failed:\n');
    if (error.cause?.code === 'ECONNREFUSED') {
      console.error('⚠️  Cannot connect to server. Make sure the backend is running:');
      console.error('   npm run start:dev');
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testTransformEndpoint();
