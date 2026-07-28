import { registerAs } from '@nestjs/config';

export default registerAs('ocr', () => ({
  engine: process.env.OCR_ENGINE || 'tesseract',
  // Tesseract Config
  tesseract: {
    lang: process.env.TESSERACT_LANG || 'ara+eng',
    psm: parseInt(process.env.TESSERACT_PSM, 10) || 6,
    oem: parseInt(process.env.TESSERACT_OEM, 10) || 3,
  },
  // Google Vision Config
  googleVision: {
    apiKey: process.env.GOOGLE_VISION_API_KEY,
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  // Processing
  maxRetries: parseInt(process.env.OCR_MAX_RETRIES, 10) || 3,
  timeout: parseInt(process.env.OCR_TIMEOUT, 10) || 30000,
}));
