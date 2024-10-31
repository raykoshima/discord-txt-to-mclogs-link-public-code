import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import config from './config.json' assert { type: "json" };
import axios from 'axios';
import url from 'url';

const { TOKEN } = config;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  
    if (message.attachments.size > 0) {
      message.attachments.forEach(async (attachment) => {
        if (attachment.name.endsWith('.txt') || attachment.name.endsWith('.log')) {
          try {
            const response = await fetch(attachment.url);
            const textContent = await response.text();
  
            // Log the content of the file to the console
            const Data = new url.URLSearchParams({ content: textContent });
            const mclogs = await axios.post("https://api.mclo.gs/1/log" , Data.toString()).then(function (response) {
                // console.log(response);
                console.log(`save file to ${response.data.url}`)
                message.reply(`here you go <@296983929456427008> ${response.data.url}`)
              .catch(console.error);
              })
              .catch(function (error) {
                console.log(error);
              });
            // await message.reply(`here mclogs of that file ${mclogs.data.url}`)
            //   .catch(console.error);

            // console.log(JSON.stringify(jsonData, null, 2));
            
          } catch (error) {
            console.error('Error fetching text file:', error);
          }
        }
      });
    }
  });
  

client.login(TOKEN);
