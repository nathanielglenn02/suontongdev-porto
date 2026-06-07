const encoder = new TextEncoder();

async function getCryptoKey(secret: string) {
  const keyData = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signToken(payload: { username: string; expiresAt: number }, secret: string): Promise<string> {
  const key = await getCryptoKey(secret);
  const dataStr = JSON.stringify(payload);
  const dataEncoded = encoder.encode(dataStr);
  const signature = await crypto.subtle.sign("HMAC", key, dataEncoded);
  
  // Convert signature to hex
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Safe base64 encoding (support non-ASCII if needed, but ASCII is enough)
  const b64Data = typeof window !== 'undefined' ? window.btoa(dataStr) : Buffer.from(dataStr).toString('base64');
  return `${b64Data}.${signatureHex}`;
}

export async function verifyToken(token: string, secret: string): Promise<{ username: string; expiresAt: number } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [b64Data, signatureHex] = parts;
    
    const key = await getCryptoKey(secret);
    const dataStr = typeof window !== 'undefined' ? window.atob(b64Data) : Buffer.from(b64Data, 'base64').toString('utf8');
    const dataEncoded = encoder.encode(dataStr);
    
    // Match hex back to Uint8Array
    const hexMatch = signatureHex.match(/.{1,2}/g);
    if (!hexMatch) return null;
    const sigBytes = new Uint8Array(hexMatch.map(byte => parseInt(byte, 16)));
    
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, dataEncoded);
    if (!isValid) return null;
    
    const payload = JSON.parse(dataStr);
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}
