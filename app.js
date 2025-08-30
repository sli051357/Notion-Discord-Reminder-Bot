// https://discordjs.guide/preparations/#installing-node-js

// const { Client, Events, GatewayIntentBits } = require('discord.js');
import { Client, Events, GatewayIntentBits } from "discord.js"
import { config } from "dotenv"

config() 

const bot_token = process.env.DISCORD_BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(bot_token)