/**
 * Supported meme sources
 */
export type MemeSource = 'reddit' | string;

/**
 * Supported output formats
 */
export type OutputFormat = 'json' | 'discord-embed';

/**
 * Media types for memes
 */
export type MediaType = 'image' | 'gif' | 'video' | 'any';

/**
 * Base Meme object
 */
export interface Meme {
    id: string;
    title: string;
    url: string;
    sourceUrl: string;
    author: string;
    subreddit?: string;
    upvotes: number;
    nsfw: boolean;
    spoiler: boolean;
    mediaType: MediaType;
    createdAt: number;
    width?: number;
    height?: number;
    source: MemeSource;
}

/**
 * Filter configuration
 */
export interface MemeFilter {
    nsfw?: boolean;
    minUpvotes?: number;
    mediaType?: MediaType;
    subreddits?: string[];
    limit?: number;
    cache?: boolean;
    format?: OutputFormat;
}

/**
 * Fetch options for MemeForge
 */
export interface FetchOptions extends MemeFilter {
    source?: MemeSource;
}

/**
 * Source handler interface
 */
export interface ISourceHandler {
    name: string;
    fetch(options: FetchOptions): Promise<Meme[]>;
}

/**
 * Discord Embed structure (simplified for the engine output)
 */
export interface DiscordEmbed {
    title: string;
    url: string;
    description?: string;
    color?: number;
    author?: {
        name: string;
        url?: string;
    };
    image?: {
        url: string;
    };
    footer?: {
        text: string;
    };
    timestamp?: string;
}
