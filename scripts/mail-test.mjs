/**
 * Verifies SMTP and optionally sends one real email.
 *   node --env-file=.env.local scripts/mail-test.mjs
 *   node --env-file=.env.local scripts/mail-test.mjs someone@example.com
 */
import { sendMail, verifyMail, welcomeEmail, unsubscribeUrl } from "../lib/mail.js";

try {
  await verifyMail();
  console.log("SMTP handshake: OK");
  console.log("unsubscribe link shape:", unsubscribeUrl("test@example.com").slice(0, 96) + "…");

  const to = process.argv[2];
  if (to) {
    const ok = await sendMail(to, welcomeEmail(to));
    console.log(ok ? `sent welcome to ${to}` : `FAILED to send to ${to}`);
  } else {
    console.log("(pass an address to send a real test email)");
  }
} catch (error) {
  console.error("SMTP failed:", error.message);
  process.exitCode = 1;
}
process.exit();
