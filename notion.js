import { Client } from "@notionhq/client";
import configData from "./config.json" with { type: "json" };

const pageId = configData.NOTION_PAGE_ID
const apiKey = configData.NOTION_KEY

const notion = new Client({
    auth: apiKey
})

export async function queryFinals(databaseId=pageId) {
    const upcoming_due = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Due Date",
            date: {
                next_month: {}
            }
        },
    });

    const assignments = new Map();
    for (let i = 0; i < upcoming_due.results.length; i++) {
        let content = upcoming_due.results[i].properties
        let assignmentName = content.Name.title[0].plain_text;
        let date = content["Due Date"].date.start;
        let assignedTo = content["Assigned To"].people[0].id;

        assignments.set(assignmentName, {
            date: date,
            assignedTo: assignedTo,
        });
    }

    return assignments
}

export async function queryIterations(databaseId=pageId) {
    const upcoming_iteration = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "First Iteration Date",
            date: {
                next_week: {}
            }
        }
    });

    const assignments = new Map();
    for (let i = 0; i < upcoming_iteration.results.length; i++) {
        let content = upcoming_iteration.results[i].properties
        let assignmentName = content.Name.title[0].plain_text;
        let date = content["First Iteration Date"].date.start;
        let assignedTo = content["Assigned To"].people[0].id;

        assignments.set(assignmentName, {
            date: date,
            assignedTo: assignedTo,
        });
    }

    return assignments
}