# 🎮 Discord Bot Integration Guide

This guide will walk you through adding MemeForge to a `discord.js` bot in under 5 minutes.

## Prerequisites

- Node.js installed
- A Discord bot project set up with `discord.js`
- `memeforge` installed: `npm install memeforge`

---

## Step 1: Initialize MemeForge

### ES Modules (TypeScript/Modern Node)
```typescript
import { memeForge } from 'memeforge';
```

### CommonJS (Standard JavaScript)
```javascript
const { memeForge } = require('memeforge');
```

## Step 2: Create a Meme Command

If you are using **Slash Commands** (recommended), add a `/meme` command to your bot.

### Command Execution Logic (CommonJS)

```javascript
const { memeForge } = require('memeforge');

async function handleMemeCommand(interaction) {
    // 1. Defer the reply (fetching from Reddit might take a second)
    await interaction.deferReply();

    try {
        // 2. Fetch a meme formatted for Discord
        const memeEmbed = await memeForge.fetchOne({
            format: 'discord-embed',
            subreddit: ['dankmemes', 'memes', 'wholesomememes'],
            nsfw: false,
            minUpvotes: 500
        });

        if (!memeEmbed) {
            return interaction.editReply('❌ Could not find any memes right now!');
        }

        // 3. Send the embed back to Discord
        await interaction.editReply({ embeds: [memeEmbed] });

    } catch (error) {
        console.error('MemeForge Error:', error);
        await interaction.editReply('⚠️ Oops! Something went wrong while forging your meme.');
    }
}
```

## Step 3: Advanced Usage (Filtering)

You can allow users to specify a subreddit or filter by media type using command options:

```javascript
const subreddit = interaction.options.getString('subreddit') || 'memes';
const type = interaction.options.getString('type') || 'any';

const embed = await memeForge.fetchOne({
    format: 'discord-embed',
    subreddit: [subreddit],
    mediaType: type,
    nsfw: interaction.channel?.nsfw || false
});
```

## Step 4: Pro-Tip (Caching)

MemeForge has a built-in **caching layer**. If multiple users run the `/meme` command within a short window, the bot will serve the cached result instantly, reducing API calls to Reddit and making your bot feel lightning-fast.

---

## Full Example Script (CommonJS)

```javascript
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { memeForge } = require('memeforge');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'meme') {
        await interaction.deferReply();
        const embed = await memeForge.fetchOne({ format: 'discord-embed' });
        await interaction.editReply({ embeds: [embed] });
    }
});

client.login('YOUR_TOKEN_HERE');
```

## 🚀 That's it!
Your bot is now powered by **MemeForge**. High-performance memes are just one command away.
