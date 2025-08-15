// https://developers.notion.com/docs/create-a-notion-integration
// https://github.com/makenotion/notion-sdk-js/blob/main/examples/intro-to-notion-api/intermediate/3-query-database.js
// https://discord.com/developers/docs/quick-start/getting-started
// https://discord.com/developers/docs/interactions/receiving-and-responding#followup-messages

import { Client } from "@notionhq/client"
import { config } from "dotenv"

config() 

const pageId = process.env.NOTION_PAGE_ID
const apiKey = process.env.NOTION_KEY

const notion = new Client({
    auth: apiKey
})

async function queryDatabase(databaseId) {
    console.log("Querying database...")
    const upcoming_due = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Due Date",
            date: {
                next_week: {}
            }
        },
    });

    const upcoming_iteration = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "First Iteration Date",
            date: {
                next_week: {}
            }
        }
    });

    console.log("Due Date");
    for (let i = 0; i < upcoming_due.results.length; i++) {
        let pageData = upcoming_due.results[i].properties.Name.title;
        console.log(pageData[0].plain_text);
    }

    console.log("First iteration")
    for (let i = 0; i < upcoming_iteration.results.length; i++) {
        let pageData = upcoming_iteration.results[i].properties.Name.title;
        console.log(pageData[0].plain_text)
    }
}

async function main() {
    const databaseId = pageId 
    queryDatabase(databaseId)
}

main()