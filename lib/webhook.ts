import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify an Exa webhook signature.
 *
 * The Exa-Signature header has the format: t=<timestamp>,v1=<hex_signature>
 * The signed payload is: {timestamp}.{raw_body}
 * The signature is HMAC-SHA256(signed_payload, webhook_secret).
 */
export function verifyWebhookSignature(
  body: string,
  signatureHeader: string,
  secret: string
): boolean {
  try {
    const parts: Record<string, string> = {};
    for (const segment of signatureHeader.split(",")) {
      const eqIdx = segment.indexOf("=");
      if (eqIdx === -1) return false;
      parts[segment.slice(0, eqIdx)] = segment.slice(eqIdx + 1);
    }

    const timestamp = parts["t"];
    const signature = parts["v1"];
    if (!timestamp || !signature) return false;

    const signedPayload = `${timestamp}.${body}`;
    const expected = createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length) return false;

    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
