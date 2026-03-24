/**
 * One-time script to create all 4 monitors via the Exa API.
 *
 * Usage:
 *   EXA_API_KEY=your_key WEBHOOK_URL=https://your-app.vercel.app/api/webhooks npx tsx scripts/create-monitors.ts
 *
 * Prints monitor IDs and the webhook secret. Update lib/monitors.ts with the IDs
 * and set WEBHOOK_SECRET in Vercel env vars.
 */

const API_KEY = process.env.EXA_API_KEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!API_KEY || !WEBHOOK_URL) {
  console.error("Set EXA_API_KEY and WEBHOOK_URL environment variables.");
  process.exit(1);
}

interface MonitorDef {
  name: string;
  query: string;
  cron: string;
  timezone: string;
  numResults: number;
  outputDescription: string;
}

const MONITOR_DEFS: MonitorDef[] = [
  {
    name: "Chess Drama & News",
    query:
      "chess drama, tournaments, Magnus Carlsen, Hikaru, Gukesh, Levy GothamChess, Botez sisters",
    cron: "0 9 * * *",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "A concise briefing of the latest chess news, drama, and tournament results",
  },
  {
    name: "OpenClaw Updates",
    query:
      "OpenClaw robot hand project updates, capabilities, builds, firmware",
    cron: "0 9 * * *",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Summary of latest OpenClaw developments and community activity",
  },
  {
    name: "Practical ML / Transformers",
    query:
      "new transformer architecture results, attention improvements, training efficiency, practical ML scaling",
    cron: "0 9 * * 2,5",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Digest of practical ML and transformer research breakthroughs",
  },
  {
    name: "Major AI Only",
    query:
      "major AI model releases, significant AI policy, large AI funding rounds",
    cron: "0 18 * * *",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Only the biggest AI news — model releases, policy shifts, major funding",
  },
];

async function createMonitor(def: MonitorDef) {
  const res = await fetch("https://api.exa.ai/search-monitors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY!,
    },
    body: JSON.stringify({
      name: def.name,
      search: {
        query: def.query,
        numResults: def.numResults,
        contents: {
          highlights: { maxCharacters: 4000 },
        },
      },
      trigger: {
        type: "cron",
        expression: def.cron,
        timezone: def.timezone,
      },
      outputSchema: {
        type: "text",
        description: def.outputDescription,
      },
      webhook: {
        url: WEBHOOK_URL!,
        events: ["monitor.run.completed"],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create "${def.name}": ${res.status} ${err}`);
  }

  return res.json();
}

async function main() {
  console.log("Creating monitors...\n");

  let webhookSecret: string | null = null;

  for (const def of MONITOR_DEFS) {
    const monitor = await createMonitor(def);
    console.log(`✓ ${monitor.name}`);
    console.log(`  ID: ${monitor.id}`);

    if (monitor.webhookSecret && !webhookSecret) {
      webhookSecret = monitor.webhookSecret;
    }
  }

  console.log("\n--- SAVE THESE ---");
  console.log(`\nWebhook Secret: ${webhookSecret}`);
  console.log("(All monitors share the same webhook URL but each has its own secret.");
  console.log("For simplicity, store the first one. In production, store all of them.)\n");
  console.log("Update lib/monitors.ts with the IDs above.");
  console.log("Set WEBHOOK_SECRET in Vercel env vars.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
