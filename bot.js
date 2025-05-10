import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import axios from 'axios';
import url from 'url';
import 'dotenv/config';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const SOURCE_CHANNEL_ID = "989585821881471067";
const TARGET_CHANNEL_ID = "1370618961044967425";

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.attachments.size > 0) {
    for (const attachment of message.attachments.values()) {
      if (attachment.name.endsWith('.txt') || attachment.name.endsWith('.log')) {
        try {
          const response = await fetch(attachment.url);
          const textContent = await response.text();

          const data = new url.URLSearchParams({ content: textContent });
          const mclogsResponse = await axios.post("https://api.mclo.gs/1/log", data.toString());
          const logUrl = mclogsResponse.data.url;
          console.log(`save file to ${logUrl}`)

          if (message.channel.id === SOURCE_CHANNEL_ID) {
            const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);
            if (targetChannel) {
              const targetMessage = await targetChannel.send(`${attachment.name} ${logUrl} <@${message.author.id}> <@1362830438460035073>`);
              await message.reply(
                `ข้อความได้ถูกส่งต่อไปอีกห้องแล้ว ${targetMessage.url}`
              );

            } else {
              console.error("Target channel not found.");
            }
          } else {
            await message.reply(`${attachment.name} ${logUrl}`);
          }
        } catch (error) {
          console.error('Error fetching text file:', error);
        }
      }
    }
  }
});

client.login(process.env.TOKEN);
