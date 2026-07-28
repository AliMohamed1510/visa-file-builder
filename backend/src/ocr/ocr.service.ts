import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';

export interface OcrResult {
  text: string;
  confidence: number;
  words: Array<{ text: string; confidence: number; bbox: any }>;
}

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private readonly lang: string;
  private readonly psm: number;

  constructor(private readonly configService: ConfigService) {
    this.lang = this.configService.get<string>('ocr.tesseract.lang', 'ara+eng');
    this.psm = this.configService.get<number>('ocr.tesseract.psm', 6);
  }

  async recognize(filePath: string): Promise<OcrResult> {
    try {
      this.logger.log(`Starting OCR for: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await Tesseract.recognize(filePath, this.lang, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            this.logger.debug(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      const words = result.data.words.map((w) => ({
        text: w.text,
        confidence: w.confidence,
        bbox: w.bbox,
      }));

      this.logger.log(`OCR completed. Confidence: ${result.data.confidence}%`);

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        words,
      };
    } catch (error) {
      this.logger.error(`OCR failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async extractPassportData(filePath: string): Promise<any> {
    const ocr = await this.recognize(filePath);
    const text = ocr.text;

    // Extract common passport fields using regex patterns
    const extracted: any = {
      rawText: text,
      confidence: ocr.confidence,
    };

    // Passport number (various formats)
    const passportMatch = text.match(/[A-Z]\d{7,9}/) || text.match(/Passport No[.:]?\s*([A-Z0-9]+)/i);
    if (passportMatch) extracted.passportNumber = passportMatch[0].replace(/[^A-Z0-9]/g, '');

    // Names
    const nameMatch = text.match(/Surname[.:]?\s*([A-Z\s]+)/i);
    if (nameMatch) extracted.lastName = nameMatch[1].trim();

    const givenNamesMatch = text.match(/Given Names[.:]?\s*([A-Z\s]+)/i);
    if (givenNamesMatch) extracted.firstName = givenNamesMatch[1].trim();

    // Nationality
    const nationalityMatch = text.match(/Nationality[.:]?\s*([A-Z]+)/i);
    if (nationalityMatch) extracted.nationality = nationalityMatch[1].trim();

    // Date of birth
    const dobMatch = text.match(/Date of birth[.:]?\s*(\d{2}[./-]\d{2}[./-]\d{4})/i);
    if (dobMatch) extracted.dateOfBirth = this.parseDate(dobMatch[1]);

    // Expiry date
    const expiryMatch = text.match(/Date of expiry[.:]?\s*(\d{2}[./-]\d{2}[./-]\d{4})/i);
    if (expiryMatch) extracted.passportExpiryDate = this.parseDate(expiryMatch[1]);

    // Gender
    const genderMatch = text.match(/Sex[.:]?\s*([MF])/i);
    if (genderMatch) extracted.gender = genderMatch[1] === 'M' ? 'MALE' : 'FEMALE';

    return extracted;
  }

  async extractHotelBooking(filePath: string): Promise<any> {
    const ocr = await this.recognize(filePath);
    const text = ocr.text;

    const extracted: any = {
      rawText: text,
      confidence: ocr.confidence,
    };

    // Hotel name
    const hotelMatch = text.match(/Hotel[.:]?\s*([A-Za-z0-9\s]+)/i) || text.match(/Reservation[.:]?\s*([A-Za-z0-9\s]+)/i);
    if (hotelMatch) extracted.hotelName = hotelMatch[1].trim();

    // Dates
    const checkInMatch = text.match(/Check.in[.:]?\s*(\d{2}[./-]\d{2}[./-]\d{4})/i);
    if (checkInMatch) extracted.checkInDate = this.parseDate(checkInMatch[1]);

    const checkOutMatch = text.match(/Check.out[.:]?\s*(\d{2}[./-]\d{2}[./-]\d{4})/i);
    if (checkOutMatch) extracted.checkOutDate = this.parseDate(checkOutMatch[1]);

    // Guest name
    const guestMatch = text.match(/Guest[.:]?\s*([A-Za-z\s]+)/i);
    if (guestMatch) extracted.guestName = guestMatch[1].trim();

    return extracted;
  }

  async extractFlightBooking(filePath: string): Promise<any> {
    const ocr = await this.recognize(filePath);
    const text = ocr.text;

    const extracted: any = {
      rawText: text,
      confidence: ocr.confidence,
    };

    // Flight number
    const flightMatch = text.match(/Flight[.:]?\s*([A-Z]{2,3}\d{3,4})/i);
    if (flightMatch) extracted.flightNumber = flightMatch[1];

    // Departure
    const depMatch = text.match(/Departure[.:]?\s*([A-Za-z\s()]+)/i);
    if (depMatch) extracted.departure = depMatch[1].trim();

    // Arrival
    const arrMatch = text.match(/Arrival[.:]?\s*([A-Za-z\s()]+)/i);
    if (arrMatch) extracted.arrival = arrMatch[1].trim();

    // Date
    const dateMatch = text.match(/Date[.:]?\s*(\d{2}[./-]\d{2}[./-]\d{4})/i);
    if (dateMatch) extracted.date = this.parseDate(dateMatch[1]);

    return extracted;
  }

  private parseDate(dateStr: string): string | null {
    try {
      const cleaned = dateStr.replace(/[./]/g, '-');
      const [d, m, y] = cleaned.split('-');
      return `${y}-${m}-${d}`;
    } catch {
      return null;
    }
  }
}
