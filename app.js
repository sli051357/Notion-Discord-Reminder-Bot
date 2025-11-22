import { Client, Events, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { queryFinals, queryIterations } from './notion.js';
import { config } from 'dotenv';
config();

const bot_token = process.env.DISCORD_BOT_TOKEN;
const channel_id = process.env.DISCORD_CHANNEL_ID;
const user_map = JSON.parse(process.env.NOTION_TO_DISCORD_MAP);

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
    const channel = client.channels.cache.get(channel_id);
    
    const final_assignments = await queryFinals();
    const iteration_assignments = await queryIterations();

    // If there are no assignments, don't send a message
    if (final_assignments.size == 0 && iteration_assignments.size == 0) {
        await client.destroy();
        process.exit(0);
    }

    let final_string = formatAssignments(final_assignments);
    let iteration_string = formatAssignments(iteration_assignments);

    const d = new Date();
    const date = d.toLocaleString('en-US', { month: '2-digit', day: '2-digit' });
    const next_date = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString('en-US', { month: '2-digit', day: '2-digit' })

    // const embed = new EmbedBuilder()
    //     .setTitle(`Upcoming Deadlines: ${date} - ${next_date}`)
    //     .setDescription(
    //         `**__Final Deadlines__**
    //         ${final_string}
    //         **__First Iteration Deadlines__**
    //         ${iteration_string}`
    //     )
    //     .setColor('#ff943d');

    const message_text = `## Upcoming Deadlines: ${date} - ${next_date}\n**__Final Deadlines__**\n${final_string}\n**__First Iteration Deadlines__**\n${iteration_string}`;

    // channel.send({ embeds: [embed] });
    await channel.send({ content: message_text });
    await client.destroy();
    process.exit(0);
});

client.login(bot_token)