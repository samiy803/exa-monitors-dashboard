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
  "01kmgyj4s00ve4fy4m2bn6tqp0",
  "01kmgyj51g3kgzgfnn9p4zcasy",
  "01kmgyj57qdem6zfhy3aedbajb",
  "01kmgyj5nhdatna0v1t1vhsrc1",
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
      "Write a synthesized report (NOT a list of sources) about the latest chess news, drama, and tournament results. Use short ## headers (2-5 words). Under each header, write 2-3 sentences of prose summarizing what happened. Use **bold** for key names. Use bullet points only for lists of specific items. Never output raw source titles or URLs.",
  },
  {
    name: "OpenClaw Updates",
    query:
      "OpenClaw AI agent framework updates, releases, new features, ClawHub, plugins, skills",
    cron: "0 9 * * *",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Write a synthesized report (NOT a list of sources) about the latest OpenClaw developments and community activity. Use short ## headers (2-5 words). Under each header, write 2-3 sentences of prose. Use **bold** for key updates. Use bullet points only for lists of specific items. Never output raw source titles or URLs.",
  },
  {
    name: "Practical ML / Transformers",
    query:
      "new transformer architecture results, attention improvements, training efficiency, practical ML scaling",
    cron: "0 9 * * 2,5",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Write a synthesized report (NOT a list of sources) about practical ML and transformer research breakthroughs. Use short ## headers (2-5 words). Under each header, write 2-3 sentences of prose. Use **bold** for paper names and methods. Use bullet points only for lists of specific items. Never output raw source titles or URLs.",
  },
  {
    name: "Major AI Only",
    query:
      "major AI model releases, significant AI policy, large AI funding rounds",
    cron: "0 18 * * *",
    timezone: "America/New_York",
    numResults: 10,
    outputDescription:
      "Write a synthesized report (NOT a list of sources) about only the biggest AI news — model releases, policy shifts, major funding. Use short ## headers (2-5 words). Under each header, write 2-3 sentences of prose. Use **bold** for companies and figures. Use bullet points only for lists of specific items. Never output raw source titles or URLs.",
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
