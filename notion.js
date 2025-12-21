import { Client } from "@notionhq/client";
import { config } from 'dotenv';
config();

const pageId = process.env.NOTION_PAGE_ID_BASE;
const pageIdProjects = process.env.NOTION_PAGE_ID_PROJECTS;
const apiKey = process.env.NOTION_KEY;

const notion = new Client({
    auth: apiKey
});

// Gets list of projects from project database
const projects = new Map();
const project_query = await notion.databases.query({
    database_id: pageIdProjects,
    filter: {
        and: [
            {
                property: "Status",
                status: {
                    does_not_equal: "Done"
                }
            },
            {
                property: "Status",
                status: {
                    does_not_equal: "Canceled"
                }
            }
        ]
    },
    sorts: [
        {
            property: "Event Type",
            direction: "ascending"
        }
    ]
});
// console.log(project_query.length);
for (let i = 0; i < project_query.results.length; i++) {
    let projectId = project_query.results[i].id.toString();
    let projectName = project_query.results[i].properties["Project name"].title[0].plain_text.toString();
    
    projects.set(projectId, projectName);
}

export async function queryNextWeek(databaseId=pageId) {
    const upcoming_due = await notion.databases.query({
        database_id: databaseId,
        filter: {
            and: [
                {
                    property: "Due",
                    date: {
                        next_month: {}
                    }
                },
                {
                    property: "Status",
                    status: {
                        does_not_equal: "Archive"
                    }
                },
                {
                    property: "Status",
                    status: {
                        does_not_equal: "Done",
                    }
                }
            ]
        },
        sorts: [
            {
                property: "Project",
                direction: "ascending",
            },
            {
                property: "Due",
                direction: "ascending",
            },
            {
                property: "Assign",
                direction: "ascending",
            }
        ],
    });

    const assignments = new Map();
    for (let i = 0; i < upcoming_due.results.length; i++) {
        let content = upcoming_due.results[i].properties;
        let assignmentName = content["Task name"].title[0].plain_text;
        let date = content["Due"].date.start;
        let projectName = projects.get(content["Project"].relation[0].id);

        let assignedTo = [];
        if (content["Assign"].people.length != 0) {
            for (let j = 0; j < content["Assign"].people.length; j++) {
                assignedTo.push(content["Assign"].people[j].id);
            }
        }
        
        assignments.set(assignmentName, {
            date: date,
            assignedTo: assignedTo,
            projectName: projectName
        });
    }

    console.log(assignments);

    return assignments;
}

export async function querySecondWeek(databaseId=pageId) {
    const upcoming_iteration = await notion.databases.query({
        database_id: databaseId,
        filter: {
            and: [
                {
                    property: "First Iteration Date",
                    date: {
                        next_week: {}
                    }
                },
                {
                    property: "Status",
                    select: {
                        does_not_equal: "Archive",
                    }
                },
                {
                    property: "Status",
                    select: {
                        does_not_equal: "First Iteration",
                    }
                }
            ]
        },
        sorts: [
            {
                property: "First Iteration Date",
                direction: "ascending",
            },
            {
                property: "Assigned To",
                direction: "ascending",
            }
        ],
    });

    const assignments = new Map();
    for (let i = 0; i < upcoming_iteration.results.length; i++) {
        let content = upcoming_iteration.results[i].properties;
        let assignmentName = content.Name.title[0].plain_text;
        let date = content["First Iteration Date"].date.start;
        let assignedTo = '';

        if (content["Assigned To"].people.length != 0) {
            assignedTo = content["Assigned To"].people[0].id;
        }

        assignments.set(assignmentName, {
            date: date,
            assignedTo: assignedTo,
        });
    }

    return assignments;
}