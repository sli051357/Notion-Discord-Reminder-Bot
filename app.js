// https://developers.notion.com/docs/create-a-notion-integration
// https://github.com/makenotion/notion-sdk-js/blob/main/examples/intro-to-notion-api/intermediate/3-query-database.js
// https://discord.com/developers/docs/quick-start/getting-started

import { Client } from "@notionhq/client"
import { config } from "dotenv"

config() 

const pageId = process.env.NOTION_PAGE_ID
const apiKey = process.env.NOTION_KEY

const notion = new Client({
    auth: apiKey
})

async function findProperties(pageId) {
    const response = await notion.blocks.children.list({
        block_id: pageId
    });
    console.log(response)
}

async function queryDatabase(databaseId) {
    console.log("Querying database...")
    const response = await notion.databases.query({
        database_id: databaseId
    })

    for (let i = 0; i < response.results.length; i++) {
        console.log(response.results[i].id)
        findProperties(response.results[i].id)
    }

}

async function main() {
    const databaseId = pageId 
    queryDatabase(databaseId)
}

main()