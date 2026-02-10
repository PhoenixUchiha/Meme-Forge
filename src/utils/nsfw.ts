/**
 * Simple NSFW check based on metadata and common keywords.
 * In a real-world scenario, this could be expanded with image analysis APIs.
 */
export function isNSFW(title: string, contentUrl: string, tags: string[] = []): boolean {
    const nsfwKeywords = ['nsfw', 'porn', 'hentai', 'sexy', 'lewd', 'adult'];
    const textToTest = `${title} ${contentUrl} ${tags.join(' ')}`.toLowerCase();

    return nsfwKeywords.some(keyword => textToTest.includes(keyword));
}
