export type PartyRole = 'buyer' | 'seller';

export interface ChatMessage {
  id: string;
  sender: string;
  role: PartyRole;
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  isFlagged?: boolean;
}

export interface Section10Pillars {
  parties: {
    buyer: string;
    seller: string;
    buyerGst?: string;
    sellerGst?: string;
    confidence: number;
    rawQuote: string;
  };
  scope: {
    itemTitle: string;
    quantity: string;
    specifications: string;
    packagingDetails: string;
    confidence: number;
    rawQuote: string;
  };
  price: {
    totalAmount: string;
    unitPrice: string;
    currency: string;
    advanceRequired: string;
    paymentSchedule: string;
    confidence: number;
    rawQuote: string;
  };
  deliveryDate: {
    timeline: string;
    targetDateFormatted: string;
    deliveryLocation: string;
    isVague: boolean;
    flaggedPhrase?: string;
    confidence: number;
    rawQuote: string;
  };
}

export interface AmbiguityFlag {
  id: string;
  category: 'delivery' | 'payment' | 'specifications' | 'acceptance';
  severity: 'high' | 'medium' | 'warning';
  title: string;
  flaggedText: string;
  contextMessage: string;
  legalRisk: string;
  statuteReference: string;
  botNudgeText: string;
  resolutionOptions: string[];
  resolvedValue?: string;
  isResolved: boolean;
}

export interface BSACertificateData {
  certificateId: string;
  actTitle: string;
  sectionCode: string; // "Section 63(4), Bharatiya Sakshya Adhiniyam, 2023"
  legacyReference: string; // "Formerly Section 65B of Indian Evidence Act, 1872"
  rawPayloadHash: string;
  originalPayloadHash: string;
  tamperDetected: boolean;
  timestampISO: string;
  generatedDate: string;
  deviceFingerprint: string;
  evidenceSource: string;
  certifyingEntity: {
    systemName: string;
    complianceStandard: string;
    certifierTitle: string;
    location: string;
  };
  pillarsSummary: {
    buyer: string;
    seller: string;
    dealValue: string;
    deliveryCommitment: string;
  };
}
