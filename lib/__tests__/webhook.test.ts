import { describe, it, expect } from "vitest";
import { verifyWebhookSignature } from "@/lib/webhook";
import { createHmac } from "crypto";

function signPayload(body: string, secret: string, timestamp: number): string {
  const signedPayload = `${timestamp}.${body}`;
  const signature = createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

describe("verifyWebhookSignature", () => {
  const secret = "whsec_test_secret_123";
  const body = '{"type":"monitor.run.completed","data":{}}';
  const timestamp = 1704729600;

  it("accepts a valid signature", () => {
    const header = signPayload(body, secret, timestamp);
    expect(verifyWebhookSignature(body, header, secret)).toBe(true);
  });

  it("rejects an invalid signature", () => {
    const header = signPayload(body, "wrong_secret", timestamp);
    expect(verifyWebhookSignature(body, header, secret)).toBe(false);
  });

  it("rejects a tampered body", () => {
    const header = signPayload(body, secret, timestamp);
    expect(verifyWebhookSignature('{"tampered":true}', header, secret)).toBe(false);
  });

  it("rejects a malformed header", () => {
    expect(verifyWebhookSignature(body, "garbage", secret)).toBe(false);
  });

  it("rejects an empty header", () => {
    expect(verifyWebhookSignature(body, "", secret)).toBe(false);
  });
});
