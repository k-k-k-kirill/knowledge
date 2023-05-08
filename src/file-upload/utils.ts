import * as crypto from 'crypto';

export function removeNewlineCharacters(text: string): string {
  return text.replace(/[\r\n]+/g, ' ');
}

export function getFileHash(fileBuffer: Buffer): string {
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
}
