import { ISourceHandler, Meme, FetchOptions, MediaType } from '../types';
import { http } from '../utils/http';
import { rateLimiter } from '../core/RateLimiter';

export class RedditSource implements ISourceHandler {
    name = 'reddit';

    async fetch(options: FetchOptions): Promise<Meme[]> {
        const subreddits = options.subreddits || ['memes', 'dankmemes'];
        const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

        await rateLimiter.throttle('reddit');

        const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=100`;
        const data = await http.get<any>(url);

        if (!data || !data.data || !data.data.children) {
            return [];
        }

        return data.data.children
            .map((child: any) => this.mapToMeme(child.data))
            .filter((meme: Meme | null) => meme !== null) as Meme[];
    }

    private mapToMeme(data: any): Meme | null {
        if (!data.url || data.is_self) return null;

        // Extract video URL if available
        let finalUrl = data.url;
        let isVideo = false;

        if (data.is_video && data.media?.reddit_video?.fallback_url) {
            finalUrl = data.media.reddit_video.fallback_url;
            isVideo = true;
        }

        const mediaType = isVideo ? 'video' : this.getMediaType(finalUrl);
        if (!mediaType) return null;

        return {
            id: data.id,
            title: data.title,
            url: finalUrl,
            sourceUrl: `https://reddit.com${data.permalink}`,
            author: data.author,
            subreddit: data.subreddit,
            upvotes: data.ups,
            nsfw: data.over_18,
            spoiler: data.spoiler,
            mediaType,
            createdAt: data.created_utc * 1000,
            width: data.media?.reddit_video?.width || data.preview?.images?.[0]?.source?.width,
            height: data.media?.reddit_video?.height || data.preview?.images?.[0]?.source?.height,
            source: 'reddit',
        };
    }

    private getMediaType(url: string): MediaType | null {
        if (url.match(/\.(jpg|jpeg|png|webp)/i)) return 'image';
        if (url.match(/\.(gif|gifv)/i)) return 'gif';
        if (url.includes('v.redd.it') || url.match(/\.(mp4|webm|mov)/i)) return 'video';
        return null;
    }
}
