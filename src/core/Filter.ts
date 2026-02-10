import { Meme, MemeFilter } from '../types';

export class Filter {
    static apply(memes: Meme[], filter: MemeFilter): Meme[] {
        return memes.filter((meme) => {
            // NSFW Filter
            if (filter.nsfw === false && meme.nsfw) {
                return false;
            }

            // Upvotes Filter
            if (filter.minUpvotes && meme.upvotes < filter.minUpvotes) {
                return false;
            }

            // Media Type Filter
            if (filter.mediaType && filter.mediaType !== 'any' && meme.mediaType !== filter.mediaType) {
                return false;
            }

            // Subreddit Filter (if applicable)
            if (filter.subreddits && filter.subreddits.length > 0 && meme.subreddit) {
                if (!filter.subreddits.map(s => s.toLowerCase()).includes(meme.subreddit.toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }

    static paginate(memes: Meme[], limit?: number): Meme[] {
        if (!limit || limit <= 0) return memes;
        return memes.slice(0, limit);
    }
}
