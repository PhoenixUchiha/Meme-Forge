# Custom Sources Guide

MemeForge is designed to be fully extensible. You can register your own sources to fetch memes from any API, database, or static file.

## The `ISourceHandler` Interface

To create a new source, you need to implement the `ISourceHandler` interface:

```typescript
import { ISourceHandler, Meme, FetchOptions } from 'memeforge';

export class MyCustomSource implements ISourceHandler {
  name = 'my-source-name';

  async fetch(options: FetchOptions): Promise<Meme[]> {
    // 1. Fetch data from your API
    const data = await fetch('https://api.example.com/memes');
    const json = await data.json();

    // 2. Map data to the Meme interface
    return json.map(item => ({
      id: item.uuid,
      title: item.caption,
      url: item.image_url,
      sourceUrl: item.permalink,
      author: item.creator,
      upvotes: item.likes,
      nsfw: item.is_adult,
      spoiler: false,
      mediaType: 'image',
      createdAt: Date.now(),
      source: 'my-source-name'
    }));
  }
}
```

## Registering Your Source

Once you've created your class, register it with the global `memeForge` instance:

```typescript
import { memeForge } from 'memeforge';
import { MyCustomSource } from './MyCustomSource';

memeForge.registerSource(new MyCustomSource());
```

## Using Your Source

After registration, you can use your source by name:

```typescript
const memes = await memeForge.fetch({
  source: 'my-source-name',
  limit: 10
});
```

## Best Practices

1. **Error Handling**: Catch and normalize errors within your `fetch` method.
2. **MediaType**: Always try to determine the `mediaType` (image, gif, or video) to ensure filters work correctly.
3. **Throttling**: If your API has rate limits, use the built-in `RateLimiter` or implement your own throttling logic.
