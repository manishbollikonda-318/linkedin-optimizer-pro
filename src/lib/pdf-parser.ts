import { PDFParse } from 'pdf-parse';

/**
 * Extracts raw text from a PDF buffer.
 * Cleans formatting artifacts and returns a normalized string.
 */
export async function parseLinkedInPDF(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    
    // Normalize text: remove multiple spaces, clean non-standard characters
    const cleanText = result.text
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E]/g, '')
      .trim();
      
    return cleanText;
  } catch (error) {
    console.error('PDF Conversion Error:', error);
    throw new Error('Failed to parse PDF profile. Ensure it is a valid LinkedIn export.');
  }
}
