import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyWebhookSignature } from "@/lib/webhook";

export async function POST(request: NextRequest) {
  const secrets = process.env.WEBHOOK_SECRETS?.split(",").filter(Boolean);
  if (!secrets?.length) {
    console.error("WEBHOOK_SECRETS not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const signature = request.headers.get("exa-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const body = await request.text();

  // Each monitor has its own webhook secret — try all until one matches
  const verified = secrets.some((s) => verifyWebhookSignature(body, signature, s));
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { type?: string };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type === "monitor.run.completed") {
    revalidatePath("/");
  }

  return NextResponse.json({ ok: true });
}
