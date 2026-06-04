// Session management using Web Crypto API (no external dependencies)
// Uses HMAC-SHA256 to sign/verify a simple JSON payload stored in a cookie.

const COOKIE_NAME = 'admin_session'
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000 // 8 hours

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET env var is not set')
  return secret
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function fromB64url(str: string): Buffer {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice((str.length + 2) % 3 || 3)
  return Buffer.from(padded, 'base64')
}

export interface SessionPayload {
  role: 'ADMIN'
  email: string
  name: string
  exp: number // Unix timestamp ms
}

/**
 * Create a signed session token: base64url(payload).signature
 */
export async function signSession(payload: SessionPayload): Promise<string> {
  const secret = getSecret()
  const key = await getKey(secret)
  const enc = new TextEncoder()
  const payloadBytes = enc.encode(JSON.stringify(payload))
  const payloadB64 = b64url(payloadBytes)
  const sigBytes = enc.encode(payloadB64)
  const sig = await crypto.subtle.sign('HMAC', key, sigBytes)
  return `${payloadB64}.${b64url(sig)}`
}

/**
 * Verify and decode a session token. Returns null if invalid or expired.
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [payloadB64, sigB64] = parts
    const secret = getSecret()
    const key = await getKey(secret)
    const enc = new TextEncoder()
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      new Uint8Array(fromB64url(sigB64)),
      enc.encode(payloadB64)
    )
    if (!valid) return null
    const payload = JSON.parse(Buffer.from(fromB64url(payloadB64)).toString('utf-8')) as SessionPayload
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export { COOKIE_NAME, SESSION_DURATION_MS }
