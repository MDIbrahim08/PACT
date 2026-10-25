import crypto from 'crypto';

/**
 * Server-Side Cryptographic Evidence Module for Pact
 * Implements native Node.js crypto SHA-256 digest computation & timing-safe verification
 * Compliant with Section 63(4) Bharatiya Sakshya Adhiniyam, 2023 (BSA)
 */

const PACT_SERVER_SECRET = process.env.PACT_SECRET || 'PACT-ENTERPRISE-NOTARY-KEY-2024';

/**
 * Computes deterministic SHA-256 hash using native Node.js crypto
 */
export function computeServerSHA256(payload: string): string {
  const normalized = payload.trim().replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

/**
 * Timing-safe hash verification to prevent side-channel timing attacks
 */
export function verifyDigest(payload: string, expectedHash: string): boolean {
  if (!payload || !expectedHash) return false;
  try {
    const computed = computeServerSHA256(payload);
    const computedBuf = Buffer.from(computed, 'hex');
    const expectedBuf = Buffer.from(expectedHash, 'hex');

    if (computedBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuf, expectedBuf);
  } catch {
    return false;
  }
}

/**
 * Generates an institutional notary seal using HMAC-SHA256 for BSA 2023 § 63(4) compliance
 */
export function generateEvidenceSeal(hash: string, timestampISO: string, nodeId: string = 'PACT-NODE-MUM-01'): {
  sealId: string;
  hmacSignature: string;
  nodeIdentifier: string;
  timestamp: string;
} {
  const data = `${hash}|${timestampISO}|${nodeId}`;
  const hmac = crypto.createHmac('sha256', PACT_SERVER_SECRET).update(data).digest('hex');
  const sealId = `SEAL-BSA-${Date.now().toString(36).toUpperCase()}-${hmac.substring(0, 8).toUpperCase()}`;

  return {
    sealId,
    hmacSignature: hmac,
    nodeIdentifier: nodeId,
    timestamp: timestampISO,
  };
}

/**
 * Server-side Certificate Identifier
 */
export function generateServerCertificateId(prefix: string = 'BSA-63'): string {
  const entropy = crypto.randomBytes(4).toString('hex').toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-2024-${timestamp}-${entropy}`;
}
