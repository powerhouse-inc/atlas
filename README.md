# BAI Data Integration Demo

This demo illustrates how data from different data sources can be integrated into document models. In this demo, we are using `atlas-scope`, `atlas-foundation` and `account-transactions` document models.


## Setup

Use `bun` for faster install / load times. Alternatively, use `npm` or `pnpm`.   
Get `bun` from [bun.sh](https://bun.sh/)

To run connect with reactor follow below steps:

1. `bun install`
2. `bun generate` - this will generate the document models code from the schemas
3. `bun dev` - this will start the reactor server
4. In connect `http://localhost:3000/` - On the left hand side menu, click  on the + sign of `Public Drives`and add the `http://localhost:4001/d/powerhouse` url drive. After adding the drive you now should see a `Powerhouse` drive in the list of public drives. Do this if it's not already added.

### Sky Atlas Script

1. Back in your code editor/terminal run `bun scripts/atlas-scope/main.ts` - this will start the script that will populate the scope documents with the data.

Final output should be: 

```bash
bun scripts/atlas-scope/main.ts
Adding scope Atlas Preamble
Adding scope The Accessibility Scope
Adding scope The Protocol Scope
Adding scope The Stability Scope
Adding scope The Support Scope
Adding scope The Governance Scope
[1.77s] script
```

And the folder structure in connect should look like this:
```
Powerhouse/
└── Sky Atlas/
├── A.0 Atlas Preamble/
│ └── A.0 Atlas Preamble
├── A.1 The Governance Scope/
│ └── A.1 The Governance Scope
├── A.2 The Support Scope/
│ └── A.2 The Support Scope
├── A.3 The Stability Scope/
│ └── A.3 The Stability Scope
├── A.4 The Protocol Scope/
│ └── A.4 The Protocol Scope
└── A.5 The Accessibility Scope/
└── A.5 The Accessibility Scope
```

### Verify number of created documents

In the local graphql playground: `http://localhost:4001/analytics`

Paste the below query and run it:

```graphql
query Analytics($filter: AnalyticsFilter) {
  analytics {
    series(filter: $filter) {
      period
      start
      end
      rows {
        value
        unit
        metric
      }
    }
  }
}

{
  "filter": {
    "start": "2025-01-01",
    "metrics": "DocumentCount",
    "granularity": "total",
    "end": "2025-01-15",
    "dimensions": [
      {
        "select": "ph",
        "name": "document-type",
        "lod": 4
      }
    ],
    "currency": null
  }
```

### Account Transactions Script

1. Back in your code editor/terminal run `bun scripts/account-transactions/server/importScript.ts` - this will start the script that will populate the account transactions documents with the data.

#### Live Transaction Data Flow

Setup reactor, server and ngrok. 
- `bun dev` - start the reactor server
- `bun scripts/account-transactions/server/server.ts` - start the server that will receive the transaction data
- `ngrok http 3001 --url=<your-static-ngrok-url>` - start the ngrok server or use `ngrok http 3001` without the static url


### Troubleshooting

If there are any issues with connect, or the reactor or the scripts, try below steps:

In terminal:
- remove `.ph` folder
- re run `bun dev`

In connect:
- clear site data (inspect -> application -> `clear site data`	) 
- re add `Powerhouse` drive if necessary
