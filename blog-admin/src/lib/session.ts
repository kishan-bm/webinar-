const SECRET_KEY = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'fallback-random-secret-key-32-chars-long-or-more-webinar';
const encoder = new TextEncoder();

function bufferToBase64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptSession(payload: any): Promise<string> {
  const header = bufferToBase64url(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const data = bufferToBase64url(encoder.encode(JSON.stringify(payload)));
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${header}.${data}`)
  );
  
  const sigBase64 = bufferToBase64url(signature);
  return `${header}.${data}.${sigBase64}`;
}

export async function decryptSession(token: string): Promise<any> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SECRET_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlToBuffer(signature),
      encoder.encode(`${header}.${data}`)
    );
    
    if (!verified) return null;
    
    const decodedData = new TextDecoder().decode(base64urlToBuffer(data));
    return JSON.parse(decodedData);
  } catch (e) {
    return null;
  }
}
