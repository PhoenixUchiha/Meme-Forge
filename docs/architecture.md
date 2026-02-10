# Architecture & Design

MemeForge follows a clean, decoupled architecture to ensure high performance and easy extensibility.

## System Overview

The engine is divided into three main layers:

### 1. The Facade Layer (`MemeForge.ts`)
This is the main entry point for the user. It provides a simplified API (`fetch`, `fetchOne`) and manages high-level configurations.

### 2. The Orchestration Layer (`Fetcher.ts`)
The `Fetcher` is responsible for:
- Routing requests to the appropriate **Source Handlers**.
- Managing the **Global Cache**.
- Combining results from multiple sources (future roadmap).

### 3. The Handler Layer (`sources/`)
Each source (like Reddit) has its own handler that implements the `ISourceHandler` interface. This ensures that adding a new source (e.g., GIPHY or a custom database) doesn't require changes to the core engine.

## Data Flow

1. **Request**: User calls `memeForge.fetch()`.
2. **Cache Check**: The engine checks the in-memory cache using a hash of the request options.
3. **Throttling**: If fetching from a remote source, the `RateLimiter` ensures we don't hit API limits.
4. **Fetching**: The `HttpClient` performs the request with automatic retries and custom `User-Agent`.
5. **Filtering**: The `Filter` engine applies multi-stage filtering (NSFW, Upvotes, Media Type).
6. **Formatting**: If requested, the `DiscordFormatter` transforms the raw data into a rich embed.
7. **Response**: Clean, filtered data is returned to the user.

## Core Modules

- **Cache**: In-memory storage with TTL (Time To Live).
- **Filter**: Stateless utility to filter arrays of memes.
- **RateLimiter**: Token-bucket inspired throttling for external requests.
- **HttpClient**: A wrapper around Axios for resilient networking.
