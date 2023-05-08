export function getChunkedText(text: string, chunkSize: number): string[] {
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  return cleanedText.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
}
