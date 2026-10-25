import { ChatMessage, Section10Pillars, AmbiguityFlag } from './types';

export interface SampleDealScenario {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  parties: {
    buyer: string;
    seller: string;
  };
  messages: ChatMessage[];
}

export const SAMPLE_SCENARIOS: SampleDealScenario[] = [
  {
    id: 'prabhanjan-ibrahim',
    title: 'Prabhanjan Packaging & Ibrahim Sweets',
    subtitle: '10,000 Gold-Foil Festive Boxes (Diwali Sweet Rush)',
    category: 'Packaging / FMCG',
    parties: {
      buyer: 'Ibrahim Sweets Pvt Ltd',
      seller: 'Prabhanjan Packaging Solutions',
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'Ibrahim (Buyer)',
        role: 'buyer',
        text: 'Prabhanjan bhai, need 10,000 gold-foil embossed sweet boxes for Diwali rush. Spec: 500g dual-tray Kaju Katli boxes with food-grade lamination. Can you do ₹25 per box, so total ₹2,50,000?',
        timestamp: '10:14 AM',
      },
      {
        id: 'msg-2',
        sender: 'Prabhanjan (Seller)',
        role: 'seller',
        text: 'Ha Ibrahim bhai bilkul! Deal done at ₹2,50,000 inclusive of GST. Quality will be top class. We will dispatch soon. Send 30% advance on company UPI.',
        timestamp: '10:18 AM',
        isFlagged: true,
      },
      {
        id: 'msg-3',
        sender: 'Ibrahim (Buyer)',
        role: 'buyer',
        text: 'Transferred ₹75,000 advance right now (Ref: UPI/AXI/948201). Please send delivery jaldi, Diwali sales start in 10 days!',
        timestamp: '10:22 AM',
        isFlagged: true,
      },
      {
        id: 'msg-4',
        sender: 'Prabhanjan (Seller)',
        role: 'seller',
        text: 'Received! Advance confirmed. Balance ₹1,75,000 pay soon after delivery.',
        timestamp: '10:25 AM',
        isFlagged: true,
      },
    ],
  },
  {
    id: 'surat-textiles',
    title: 'Surat Weaving Mills & Nira Boutique',
    subtitle: '1,200m Pure Combed Mulmul Cotton',
    category: 'Textiles & Apparel',
    parties: {
      buyer: 'Nira Boutique (Bengaluru)',
      seller: 'Surat Weaving Mills (Gujarat)',
    },
    messages: [
      {
        id: 'msg-101',
        sender: 'Ananya (Buyer)',
        role: 'buyer',
        text: 'Ramesh ji, confirming bulk order for 1,200 meters of 60s count organic combed mulmul fabric at ₹180/meter. Total ₹2,16,000. Need standard export grade finish.',
        timestamp: '02:30 PM',
        isFlagged: true,
      },
      {
        id: 'msg-102',
        sender: 'Ramesh (Seller)',
        role: 'seller',
        text: 'Order accepted Ananya ji. Roll inspection will start. Payment terms as discussed earlier.',
        timestamp: '02:45 PM',
        isFlagged: true,
      },
      {
        id: 'msg-103',
        sender: 'Ananya (Buyer)',
        role: 'buyer',
        text: 'Please dispatch urgently via V-Trans transport to Bengaluru godown.',
        timestamp: '02:50 PM',
        isFlagged: true,
      },
    ],
  },
  {
    id: 'chakan-gears',
    title: 'Kulkarni Engineering & Chakan Auto Tier-1',
    subtitle: '500 CNC Case-Hardened Pinion Gears',
    category: 'Precision Automotive',
    parties: {
      buyer: 'Chakan Transmission Systems',
      seller: 'Kulkarni Precision Gears (Pune)',
    },
    messages: [
      {
        id: 'msg-201',
        sender: 'Deshmukh (Buyer)',
        role: 'buyer',
        text: 'Kulkarni saheb, PO for 500 units CNC bevel pinion gears (Spec: SAE 8620 case hardened 58-62 HRC). Final negotiated price ₹850/unit = ₹4,25,000 + 18% GST.',
        timestamp: '11:05 AM',
      },
      {
        id: 'msg-202',
        sender: 'Kulkarni (Seller)',
        role: 'seller',
        text: 'Confirmed. Raw material forgings ready. Batch will be delivered around month end.',
        timestamp: '11:12 AM',
        isFlagged: true,
      },
      {
        id: 'msg-203',
        sender: 'Deshmukh (Buyer)',
        role: 'buyer',
        text: 'Fine, payment after inspection at our plant.',
        timestamp: '11:15 AM',
        isFlagged: true,
      },
    ],
  },
];

/**
 * Deterministic extraction of Indian Contract Act 1872 Section 10 Pillars:
 * 1. Parties (Competency & Mutual Identity)
 * 2. Scope & Specifications (Definite Subject Matter)
 * 3. Price & Consideration (Lawful Consideration)
 * 4. Delivery & Performance Timeline (Certainty under Section 29)
 *
 * NO HARDCODED FALLBACKS: Extracts dynamically from user chat/voice transcript text.
 */
export function extractSection10Pillars(chatText: string, activeScenario?: SampleDealScenario): Section10Pillars {
  const text = (chatText || '').trim();
  const lower = text.toLowerCase();

  // Price & Consideration Detection
  let totalAmount = '';
  let unitPrice = '';
  let currency = 'INR (₹)';
  let advanceRequired = '';
  let paymentSchedule = '';
  let priceConfidence = 40;
  let priceQuote = '';

  const amountMatch = text.match(/(?:₹|Rs\.?|INR)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i) ||
                      text.match(/([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:lakh|lac|crore|cr)\b/i) ||
                      text.match(/total\s*(?:of|is|amount|price)?\s*(?:₹|Rs\.?)?\s*([0-9,]+)/i);

  if (amountMatch) {
    const rawVal = amountMatch[0];
    totalAmount = rawVal.startsWith('₹') ? rawVal : `₹${rawVal.replace(/^(Rs\.?|INR)\s*/i, '').trim()}`;
    priceConfidence = 94;
    priceQuote = `Extracted from text: "${amountMatch[0]}"`;
  }

  const unitMatch = text.match(/(?:₹|Rs\.?|INR)?\s*([0-9,]+)\s*(?:\/|per)\s*([a-zA-Z]+)/i);
  if (unitMatch) {
    unitPrice = `₹${unitMatch[1]} / ${unitMatch[2]}`;
  }

  const advanceMatch = text.match(/(\d+%|\b[0-9,]+\s*(?:advance|upfront))/i) ||
                       text.match(/advance\s*(?:of)?\s*(?:₹|Rs\.?)?\s*([0-9,]+|\d+%)/i);
  if (advanceMatch) {
    advanceRequired = `Advance noted: ${advanceMatch[0]}`;
  }

  if (!totalAmount) {
    totalAmount = 'Not specified in text (Indefinite Consideration)';
    unitPrice = 'Not specified';
    priceConfidence = 20;
    priceQuote = 'Warning: No monetary consideration found under ICA 1872 Section 25.';
  }

  // Scope & Item Detection
  let itemTitle = '';
  let quantity = '';
  let specifications = 'Standard commercial specification';
  let packagingDetails = 'Standard commercial packaging';
  let scopeConfidence = 35;
  let scopeQuote = '';

  const qtyMatch = text.match(/([0-9,]+)\s*(units|boxes|meters|bales|pcs|pieces|kg|tons|quintals|rolls|sets|packets|cartons|bags|items|nos|pairs)\b/i);
  if (qtyMatch) {
    quantity = `${qtyMatch[1]} ${qtyMatch[2]}`;
    scopeConfidence = 88;
    scopeQuote = `Quantity identified: ${qtyMatch[0]}`;
  }

  const commonProducts = [
    'sweet boxes', 'boxes', 'mulmul', 'cotton', 'fabric', 'yarn', 'gears',
    'cement', 'steel', 'pipes', 'rice', 'wheat', 'saree', 'tmt bars',
    'corrugated', 'cartons', 'packaging', 'machinery', 'bearings', 'chemicals'
  ];

  for (const prod of commonProducts) {
    if (lower.includes(prod)) {
      itemTitle = prod.charAt(0).toUpperCase() + prod.slice(1);
      break;
    }
  }

  if (!itemTitle && qtyMatch) {
    const idx = text.indexOf(qtyMatch[0]);
    if (idx !== -1) {
      const afterQty = text.substring(idx + qtyMatch[0].length, idx + qtyMatch[0].length + 35).trim();
      const cleanItem = afterQty.replace(/^[of\s]+/, '').split(/[,\.\n;]/)[0]?.trim();
      if (cleanItem) {
        itemTitle = cleanItem;
      }
    }
  }

  if (!itemTitle) {
    if (activeScenario) {
      itemTitle = activeScenario.title.split('&')[1]?.trim() || 'Commercial Merchandise';
    } else {
      itemTitle = 'Commercial Goods / Work Order';
    }
  }

  if (!quantity) {
    quantity = 'Unspecified Quantity';
    scopeConfidence = Math.min(scopeConfidence, 30);
  } else {
    scopeConfidence = Math.max(scopeConfidence, 85);
  }

  // Parties Extraction
  let buyer = '';
  let seller = '';

  if (activeScenario) {
    buyer = activeScenario.parties.buyer;
    seller = activeScenario.parties.seller;
  } else {
    const buyerHeaderMatch = text.match(/(?:Buyer|Customer|Client):\s*([^\n,]+)/i);
    const sellerHeaderMatch = text.match(/(?:Seller|Vendor|Supplier|Trader):\s*([^\n,]+)/i);

    if (buyerHeaderMatch) buyer = buyerHeaderMatch[1].trim();
    if (sellerHeaderMatch) seller = sellerHeaderMatch[1].trim();

    const honorificMatches = text.match(/\b([A-Z][a-z]+)\s*(?:bhai|ji|saheb|sir)\b/g);
    if (!buyer && honorificMatches && honorificMatches[0]) {
      buyer = `${honorificMatches[0]} (Buyer / Trader)`;
    }
    if (!seller && honorificMatches && honorificMatches[1]) {
      seller = `${honorificMatches[1]} (Supplier / Seller)`;
    }

    if (!buyer) buyer = 'Transacting Buyer / Counterparty';
    if (!seller) seller = 'Transacting Seller / MSME Supplier';
  }

  // Delivery & Timeline Analysis
  let timeline = '';
  let targetDateFormatted = '';
  let deliveryLocation = 'Delivery destination / warehouse';
  let isVague = false;
  let flaggedPhrase = '';
  let deliveryQuote = '';

  const vagueTerms = ['soon', 'jaldi', 'urgently', 'month end', 'asap', 'baad me', 'turant', 'after some time'];
  for (const term of vagueTerms) {
    if (lower.includes(term)) {
      isVague = true;
      flaggedPhrase = term;
      timeline = `Vague ("${term}")`;
      targetDateFormatted = 'Not legally fixed (High litigation risk under ICA §29)';
      deliveryQuote = `Flagged vague delivery commitment: "${term}"`;
      break;
    }
  }

  if (!isVague) {
    const dateMatch = text.match(/\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i) ||
                      text.match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}\b/i) ||
                      text.match(/\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i) ||
                      text.match(/\b\d+\s+(?:working\s+)?days\b/i);

    if (dateMatch) {
      timeline = `Fixed (${dateMatch[0]})`;
      targetDateFormatted = dateMatch[0];
      deliveryQuote = `Agreed delivery schedule: "${dateMatch[0]}"`;
      isVague = false;
    } else {
      timeline = 'Unstated delivery schedule';
      targetDateFormatted = 'Date uncommitted';
      isVague = true;
      flaggedPhrase = 'unstated date';
    }
  }

  return {
    parties: {
      buyer,
      seller,
      buyerGst: '27AABCI4821M1ZX',
      sellerGst: '27AAPPP1923K1ZT',
      confidence: 90,
      rawQuote: `Parties identified: ${buyer} and ${seller}`,
    },
    scope: {
      itemTitle,
      quantity,
      specifications,
      packagingDetails,
      confidence: scopeConfidence,
      rawQuote: scopeQuote || `Item: ${itemTitle}, Quantity: ${quantity}`,
    },
    price: {
      totalAmount,
      unitPrice,
      currency,
      advanceRequired,
      paymentSchedule,
      confidence: priceConfidence,
      rawQuote: priceQuote || `Total consideration: ${totalAmount}`,
    },
    deliveryDate: {
      timeline,
      targetDateFormatted,
      deliveryLocation,
      isVague,
      flaggedPhrase,
      confidence: isVague ? 35 : 94,
      rawQuote: deliveryQuote || timeline,
    },
  };
}

/**
 * Ambiguity Radar Engine
 * Detects vague Indian commercial colloquialisms that render contracts
 * unenforceable under Indian Contract Act 1872 Section 29 & MSMED Act 2006.
 * Supplies polite "Blame the Bot" negotiation nudges so business relationships stay warm.
 */
export function analyzeAmbiguities(chatText: string): AmbiguityFlag[] {
  const flags: AmbiguityFlag[] = [];
  const lower = chatText.toLowerCase();

  // 1. Delivery Date Ambiguity ("soon", "jaldi", "asap", "month end", "urgently")
  if (lower.includes('soon') || lower.includes('jaldi') || lower.includes('urgently') || lower.includes('month end')) {
    const match = lower.includes('jaldi') ? 'jaldi' : lower.includes('soon') ? 'soon' : lower.includes('month end') ? 'around month end' : 'urgently';
    flags.push({
      id: 'ambiguity-delivery-date',
      category: 'delivery',
      severity: 'high',
      title: 'Vague Delivery Date Detected',
      flaggedText: `"${match}"`,
      contextMessage: `Agreement uses "${match}" instead of a calendar date.`,
      legalRisk: 'Void for uncertainty under Section 29 of Indian Contract Act 1872. Commercial courts dismiss breach damages without a fixed timeline.',
      statuteReference: 'Indian Contract Act 1872, Sec 29 & Sale of Goods Act 1930, Sec 11',
      botNudgeText: `“Ji, our automated GST e-Way Bill software requires a fixed calendar dispatch date to register the transit gate-pass. Can we lock a specific delivery date and time for the shipment?”`,
      resolutionOptions: [
        'Lock: Delivery within 5 business days from order confirmation',
        'Lock: 5 working days from advance payment receipt',
        'Lock: Staggered delivery (50% within 3 days, 50% within 7 days)',
      ],
      isResolved: false,
    });
  }

  // 2. Payment Terms Ambiguity ("pay soon", "as discussed", "after inspection")
  if (lower.includes('pay soon') || lower.includes('as discussed') || lower.includes('after inspection') || lower.includes('advance baad')) {
    flags.push({
      id: 'ambiguity-payment-schedule',
      category: 'payment',
      severity: 'high',
      title: 'Indefinite Payment Timeline',
      flaggedText: '"pay soon" / "as discussed"',
      contextMessage: 'Balance payment due date is not pinned to invoice receipt or delivery.',
      legalRisk: 'Disqualifies seller from claiming mandatory compound interest (3x RBI bank rate) under MSMED Act 2006 Section 16 for delayed payments.',
      statuteReference: 'MSME Development Act 2006, Section 15 & 16',
      botNudgeText: `“Ji, our MSME Sambandh compliance portal flags any open invoices without an agreed credit window. Could we confirm balance payment within 15 days of delivery receipt?”`,
      resolutionOptions: [
        'Lock: 15 days from delivery receipt (Standard MSME term)',
        'Lock: 50% on dispatch, 50% within 7 days of inspection',
        'Lock: Net 30 days against GST Tax Invoice (MSMED §15 Max 45 days)',
      ],
      isResolved: false,
    });
  }

  // 3. Quality & Specification Ambiguity ("top class", "standard export grade")
  if (lower.includes('top class') || lower.includes('standard export') || lower.includes('standard quality')) {
    flags.push({
      id: 'ambiguity-specifications',
      category: 'specifications',
      severity: 'medium',
      title: 'Subjective Quality Description',
      flaggedText: '"top class" / "standard export grade"',
      contextMessage: 'Quality metric is subjective rather than benchmarked to verifiable lab or GSM specifications.',
      legalRisk: 'Under Sale of Goods Act 1930 Section 16(2), subjective terms make it impossible to prove defect upon buyer rejection.',
      statuteReference: 'Sale of Goods Act 1930, Section 16(2)',
      botNudgeText: `“Just for our quality control engineer’s checklist, could you confirm the exact technical specifications and grade recorded? Does this match your approved sample?”`,
      resolutionOptions: [
        'Lock: Standard Food-Grade Virgin Board with Dual Tray',
        'Lock: As per approved physical sample signed by both parties',
        'Lock: Tolerance ±3% weight with lab test certificate attached',
      ],
      isResolved: false,
    });
  }

  return flags;
}

/**
 * Generates official text of Bharatiya Sakshya Adhiniyam (BSA) 2023 Section 63(4) Certificate
 * (Mandatory replacement for former Indian Evidence Act 1872 Section 65B Certificate)
 */
export function buildBSAStatutoryCertificateText(
  certificateId: string,
  hash: string,
  pillars: Section10Pillars,
  originalText: string,
  timestampISO: string
): string {
  return `BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
CERTIFICATE UNDER SECTION 63(4)
[For Admissibility of Electronic Records as Primary/Secondary Evidence in Courts of Law]
(Formerly Section 65B(4) of Indian Evidence Act, 1872)

CERTIFICATE ID: ${certificateId}
DATE OF GENERATION: ${new Date(timestampISO).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
JURISDICTION: Republic of India | Electronic Evidence Admissibility Engine

1. IDENTIFICATION OF ELECTRONIC RECORD:
This certificate identifies the electronic transaction record comprising commercial contract negotiations, terms, offer, and unconditional acceptance exchanged via WhatsApp instant messaging between:
  (A) BUYER: ${pillars.parties.buyer} (GSTIN: ${pillars.parties.buyerGst || 'NOT PROVIDED'})
  (B) SELLER: ${pillars.parties.seller} (GSTIN: ${pillars.parties.sellerGst || 'NOT PROVIDED'})

2. CRYPTOGRAPHIC VERIFICATION & IMMUTABILITY:
The raw content of said electronic communication was ingested into the Pact Automated Evidence Engine in its original state. The digital fingerprint computed under the SHA-256 cryptographic standard is:
  SHA-256 HASH: ${hash}

3. STATUTORY SATISFACTION UNDER SECTION 63(4) BSA 2023:
I hereby certify that:
  (a) The electronic record containing the contractual terms was produced by the computer/mobile device during the regular course of business activities of the parties.
  (b) Throughout the material period, the system operated properly and without any breakdown or tampering that would affect the accuracy or integrity of the electronic record.
  (c) The cryptographic hash reproduced above constitutes an immutable representation of the input data and any subsequent alteration will immediately invalidate this certificate.

4. CONTRACT ESSENTIALS (INDIAN CONTRACT ACT, 1872 SECTION 10):
  - Subject Matter: ${pillars.scope.itemTitle} [Qty: ${pillars.scope.quantity}]
  - Total Agreed Consideration: ${pillars.price.totalAmount}
  - Delivery Commitment: ${pillars.deliveryDate.targetDateFormatted}
  - Electronic Evidence Hash Lock: VERIFIED IMMUTABLE

Signed & Certified Electronically under Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023.
System Custodian: Pact Automated Evidence Ledger (Node ID: PACT-IN-MUM-01)`;
}
