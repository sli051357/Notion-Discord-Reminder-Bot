import { Client, GatewayIntentBits } from "discord.js";
import keyData from './keyinfo.json' with { type: "json" };
import fs from "node:fs"
// import { queryFinals, queryIterations } from './notion.js';
import { config } from 'dotenv';
config();

const bot_token = process.env.DISCORD_BOT_TOKEN;
//const user_map = JSON.parse(process.env.NOTION_TO_DISCORD_MAP);

const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // sends the contents of keyinfo.json
    if (command === 'key') {
        await message.reply(JSON.stringify(keyData, null, " \n").replace(/[\{\}"]/g, "").replaceAll(",", ""));    
    }

    // updates keyinfo.json
    // !keyupdate key1 user_id -> will update keyinfo.json to "key1":"@user_id"
    if (command === 'keyupdate') {
        const key = args[0];   // "key1"
        const user_id = args[1];  // "user_id"

        if (user_id === undefined) {
            message.reply("u didnt tell me who has that key <:kwibumm:1441314195995103323>");
            return;
        }

        if (key === "donny") { keyData.donny = user_id }
        else if (key === "sanrio") { keyData.sanrio = user_id }
        else if (key === "watermelon") { keyData.watermelon = user_id }
        else if (key === "egg") { keyData.egg = user_id }
        else {
            message.reply("key not found <:wah:1559644644365828166>")
            return;
        }
        
        message.reply("updated " + key);
        fs.writeFileSync("./keyinfo.json", JSON.stringify(keyData, null, 2), 'utf8');
    }
});

client.login(bot_token)