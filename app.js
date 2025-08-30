// https://discordjs.guide/preparations/#installing-node-js

// const { Client, Events, GatewayIntentBits } = require('discord.js');
import { Client, Events, GatewayIntentBits, EmbedBuilder } from "discord.js";
import configData from "./config.json" with { type: "json" };
import { queryFinals, queryIterations } from './notion.js';

const bot_token = configData.DISCORD_BOT_TOKEN;
const channel_id = configData.DISCORD_CHANNEL_ID;
const user_map = configData.notionToDiscordMap;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const formatAssignments = (assignments) => {
    let message = ``;
    for (const [key, value] of assignments) {
        let date = value.date.substring(5).replace("-", "/")
        message += `**${date}** — ${key} by <@${user_map[value.assignedTo]}>\n`;
    }
    if (message === ``) {
        message = `*None upcoming*\n`
    }
    return message
};

client.once(Events.ClientReady, async readyClient => {
    // console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const channel = client.channels.cache.get(channel_id);
    
    const final_assignments = await queryFinals();
    const iteration_assignments = await queryIterations();

    let final_string = formatAssignments(final_assignments);
    let iteration_string = formatAssignments(iteration_assignments);

    const d = new Date();
    const date = d.toLocaleString('en-US', { month: '2-digit', day: '2-digit' });
    const next_date = new Date(d.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleString('en-US', { month: '2-digit', day: '2-digit' })

    const embed = new EmbedBuilder()
        .setTitle(`Upcoming Deadlines: ${date} - ${next_date}`)
        .setDescription(
            `**__Final Deadlines__**
            ${final_string}
            **__First Iteration Deadlines__**
            ${iteration_string}`
        )
        .setColor('#ff943d')

    channel.send({ embeds: [embed] });
});

client.login(bot_token)