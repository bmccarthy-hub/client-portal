// Shared helper: SHA-256 hash of a string, returned as lowercase hex.
// Used by both the login page and each client page's passcode gate so
// that passcodes are never stored or compared in plain text in the JS.
async function sha256Hex(message) {
  const data = new TextEncoder().encode(message.trim());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
