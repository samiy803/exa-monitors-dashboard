/**
 * Delete existing monitors and recreate with markdown-formatted output.
 *
 * Usage:
 *   EXA_API_KEY=your_key npx tsx scripts/recreate-monitors.ts
 *
 * Optionally set WEBHOOK_URL (defaults to https://exa-monitors.vercel.app/api/webhooks).
 * Prints new monitor IDs — update lib/monitors.ts with them.
 */

const API_KEY = process.env.EXA_API_KEY;
const WEBHOOK_URL =
  process.env.WEBHOOK_URL ??
  "https://exa-monitors.vercel.app/api/webhooks";

if (!API_KEY) {
  console.error("Set EXA_API_KEY environment variable.");
  process.exit(1);
}

const OLD_IDS = [
  "01kmgy0pd4b12t68c2gy3yhj25",
  "01kmgy0pqv0n19nhj1cg3zz7n1",
  "01kmgy0pzhk3bgpn50cfhyv27g",
  "01kmgy0q6avy1qqhc1y26vftqz",
];

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
      "Write a markdown-formatted briefing. Use short ## headers (2-5 words max, never sentences). Put all detail in body text and bullet points below headers. Use **bold** for names/events and [links](url) where relevant.",
  },
  {
    name: "OpenClaw Updates",
    query:
      "OpenClaw AI agent framework updates, releases, new features, ClawHub, plugins, skills",
    cron: "0 9 * * *",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Write a markdown-formatted summary. Use short ## headers (2-5 words max, never sentences). Put all detail in body text and bullet points below headers. Use **bold** for key updates and [links](url) where relevant.",
  },
  {
    name: "Practical ML / Transformers",
    query:
      "new transformer architecture results, attention improvements, training efficiency, practical ML scaling",
    cron: "0 9 * * 2,5",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Write a markdown-formatted digest. Use short ## headers (2-5 words max, never sentences). Put all detail in body text and bullet points below headers. Use **bold** for paper names/methods and [links](url) where relevant.",
  },
  {
    name: "Major AI Only",
    query:
      "major AI model releases, significant AI policy, large AI funding rounds",
    cron: "0 18 * * *",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Write a markdown-formatted briefing of only the biggest AI news. Use short ## headers (2-5 words max, never sentences). Put all detail in body text and bullet points below headers. Use **bold** for companies/figures and [links](url) where relevant.",
  },
];

async function deleteMonitor(id: string): Promise<boolean> {
  const res = await fetch(`https://api.exa.ai/monitors/${id}`, {
    method: "DELETE",
    headers: { "x-api-key": API_KEY! },
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  Failed to delete ${id}: ${res.status} ${err}`);
    return false;
  }
  return true;
}

async function createMonitor(def: MonitorDef) {
  const res = await fetch("https://api.exa.ai/monitors", {
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
        url: WEBHOOK_URL,
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
  console.log("Deleting old monitors...\n");
  for (const id of OLD_IDS) {
    const ok = await deleteMonitor(id);
    console.log(`  ${ok ? "✓" : "✗"} ${id}`);
  }

  console.log("\nCreating new monitors...\n");
  const newIds: string[] = [];
  let webhookSecret: string | null = null;

  for (const def of MONITOR_DEFS) {
    const monitor = await createMonitor(def);
    console.log(`  ✓ ${monitor.name}`);
    console.log(`    ID: ${monitor.id}`);
    newIds.push(monitor.id);

    if (monitor.webhookSecret && !webhookSecret) {
      webhookSecret = monitor.webhookSecret;
    }
  }

  console.log("\n--- UPDATE lib/monitors.ts WITH THESE IDs ---\n");
  console.log(`Chess:    "${newIds[0]}"`);
  console.log(`OpenClaw: "${newIds[1]}"`);
  console.log(`ML:       "${newIds[2]}"`);
  console.log(`AI:       "${newIds[3]}"`);

  if (webhookSecret) {
    console.log(`\nWebhook Secret: ${webhookSecret}`);
    console.log("Update WEBHOOK_SECRET in Vercel env vars if changed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
