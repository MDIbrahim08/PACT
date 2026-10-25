"use client";

/* eslint-disable react/no-unknown-property */

import { cn } from "@/lib/utils";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  Copy, 
  Check, 
  X, 
  Volume2, 
  ChevronRight
} from "lucide-react";

export interface NewsletterBookshelfItem {
  id: string;
  title: string;
  date: string;
  subtitle?: string;
  href?: string;
  color?: string;
  foil?: string;
  category?: string;
  readTime?: string;
  statute?: string;
  portalName?: string;
  fullArticle?: {
    overview: string;
    keyTakeaways: string[];
    statutoryBacking: string;
    sampleClause: string;
    actionSteps: string[];
  };
}

export interface NewsletterBookshelfProps {
  items?: NewsletterBookshelfItem[];
  className?: string;
  height?: number | string;
  brand?: string;
  onSelect?: (item: NewsletterBookshelfItem, index: number) => void;
  onOpen?: (item: NewsletterBookshelfItem, index: number) => void;
}

type BookLayout = NewsletterBookshelfItem & {
  x: number;
  width: number;
  bookHeight: number;
  depth: number;
  motif: number;
  color: string;
  foil: string;
};

const PALETTE = [
  "#0b1e4b",
  "#16277a",
  "#2233b8",
  "#4040ff",
  "#6b7bff",
  "#9fb0ff",
  "#dce4ff",
  "#faf7ee",
  "#efe8d4",
  "#f4f2ec",
  "#25252a",
  "#3a3a40",
];

// Curated Legal & Business Library specifically designed for Indian MSMEs & Small Businesses
export const MSME_BUSINESS_BOOKS: NewsletterBookshelfItem[] = [
  {
    id: "edition-msme-payment-recovery",
    title: "MSME 45-Day Payment Recovery",
    date: "OCT 2026",
    subtitle: "Enforcing Section 15 and 16 of MSMED Act 2006: Compounding interest and zero-bad-debt protocols.",
    category: "Cash Flow & Recovery",
    readTime: "4 min read",
    statute: "MSMED Act 2006 §15 & §16",
    portalName: "MSME Samadhaan Portal",
    href: "https://samadhaan.msme.gov.in",
    color: "#0f231c",
    foil: "#eedcb3",
    fullArticle: {
      overview: "Delayed payments severely constrain small business working capital. Under Section 15 of the MSMED Act, buyers must settle dues within 45 days of delivery. Section 16 mandates a statutory penalty of three times the RBI bank rate compounded monthly if payments exceed the statutory window.",
      keyTakeaways: [
        "The statutory payment window is capped at 45 days, superseding any contrary credit term in buyer agreements.",
        "Compound interest at three times the RBI notified bank rate applies automatically with monthly rests.",
        "Section 43B(h) of the Income Tax Act disallows buyer tax deductions on unpaid MSME invoice expenses.",
        "Petitions can be submitted directly on the MSME Samadhaan portal without court fee requirements."
      ],
      statutoryBacking: "Section 15 & 16, Micro, Small and Medium Enterprises Development Act, 2006: Where any buyer fails to make payment of the amount to the supplier, he shall be liable to pay compound interest with monthly rests to the supplier at three times of the bank rate notified by RBI.",
      sampleClause: "Payment Terms: Payment shall be disbursed within 30 days of physical receipt of invoice. All outstanding balances exceeding 45 days shall automatically attract compound interest with monthly rests at three times the RBI notified bank rate pursuant to Section 16 of the MSMED Act, 2006.",
      actionSteps: [
        "Include active Udyam Registration number on all quotations, delivery challans, and commercial tax invoices.",
        "Retain timestamped dispatch records, lorry receipts (LR), or signed electronic proof of delivery.",
        "Issue formal statutory payment reconciliation reminders on Day 30 of the 45-day window.",
        "Initiate conciliation proceedings via samadhaan.msme.gov.in upon default past 45 days."
      ]
    }
  },
  {
    id: "edition-whatsapp-contract-handshake",
    title: "The WhatsApp Contract Handshake",
    date: "OCT 2026",
    subtitle: "Formalizing electronic negotiations and voice agreements under Indian Contract Act Section 10.",
    category: "Contract Enforceability",
    readTime: "5 min read",
    statute: "Indian Contract Act 1872 §10",
    portalName: "India Code - Contract Act",
    href: "https://www.indiacode.nic.in/handle/123456789/2187",
    color: "#0b1e4b",
    foil: "#dce4ff",
    fullArticle: {
      overview: "Commercial agreements conducted over WhatsApp or instant messaging constitute enforceable contracts under Section 10 of the Indian Contract Act, provided four essential pillars exist: free consent, competent parties, lawful consideration, and a lawful object.",
      keyTakeaways: [
        "A formal stamped instrument is not a legal prerequisite for contract formation under Indian statutory jurisprudence.",
        "Audio voice notes in regional vernacular languages demonstrate valid commercial consensus ad idem.",
        "Agreements lacking certainty of price, quantity, or delivery dates are void under Section 29.",
        "Pact extracts the four statutory pillars into a cryptographic recap slip prior to dispatch."
      ],
      statutoryBacking: "Section 10, Indian Contract Act, 1872: All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.",
      sampleClause: "Electronic Deal Confirmation: This transaction is formalized via bilateral electronic communications pursuant to Section 10 of the Indian Contract Act, 1872. Acceptance of this message or acceptance of goods constitutes conclusive approval of specified rates, quantities, and settlement timelines.",
      actionSteps: [
        "Avoid dispatching consignments based solely on informal affirmations without documented commercial specifications.",
        "Ensure all four pillars—Item, Quantity, Rate, and Delivery Date—are explicitly summarized in chat.",
        "Generate a verified recap summary card to establish unambiguous mutual consent."
      ]
    }
  },
  {
    id: "edition-electronic-evidence-bsa",
    title: "Court Proof Under BSA 2023 §63",
    date: "SEP 2026",
    subtitle: "Admissibility of electronic trade logs, voice recordings, and dual-hash statutory verification.",
    category: "Court Evidence",
    readTime: "6 min read",
    statute: "Bharatiya Sakshya Adhiniyam 2023 §63(4)",
    portalName: "Ministry of Home Affairs - BSA",
    href: "https://www.mha.gov.in",
    color: "#2233b8",
    foil: "#faf7ee",
    fullArticle: {
      overview: "Effective July 2024, the Bharatiya Sakshya Adhiniyam (BSA) 2023 replaces the Indian Evidence Act 1872. Section 63(4) now governs the admissibility of electronic records in commercial proceedings, mandating strict hash integrity and verified system certificates.",
      keyTakeaways: [
        "Standard mobile screenshots face frequent challenges in commercial courts on grounds of alteration or tampering.",
        "Dual-hash integrity (SHA-256 of raw audio combined with SHA-256 of contract JSON) verifies non-alteration.",
        "The Section 63(4) electronic certificate supersedes legacy 65B affidavits and can be generated instantly by Pact.",
        "Timestamped device logs and server-side cryptographic signatures defeat counterparty repudiation claims."
      ],
      statutoryBacking: "Section 63(4), Bharatiya Sakshya Adhiniyam, 2023: Electronic records shall be accompanied by an electronic certificate identifying the electronic record and describing the manner in which it was produced by a computer system in lawful control.",
      sampleClause: "Evidence Integrity Clause: The parties agree that all digital transcripts, transaction logs, and dual-hash records maintained by the automated compliance system shall be admitted as primary electronic evidence under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023.",
      actionSteps: [
        "Export and preserve the uninterrupted WhatsApp chat history without deleting preceding records.",
        "Store original digital audio recordings (.opus/.m4a) in pristine, uncompressed format.",
        "Attach the Pact Section 63(4) statutory certificate with recorded cryptographic checksums."
      ]
    }
  },
  {
    id: "edition-section-29-ambiguity-radar",
    title: "Section 29 Ambiguity Radar",
    date: "SEP 2026",
    subtitle: "Eliminating void vague clauses such as 'payment soon' or 'quality as usual' before dispatch.",
    category: "Risk Prevention",
    readTime: "4 min read",
    statute: "Indian Contract Act 1872 §29",
    portalName: "Indian Commercial Case Law",
    href: "https://www.indiacode.nic.in/handle/123456789/2187",
    color: "#7f1d1d",
    foil: "#efe8d4",
    fullArticle: {
      overview: "Section 29 of the Indian Contract Act specifies that agreements, the meaning of which is not certain, or capable of being made certain, are void. Vague commercial phrases such as 'payment within a reasonable time' or 'rate per market standard' undermine legal enforceability.",
      keyTakeaways: [
        "Ambiguous commercial terms provide delinquent counterparties with straightforward legal defenses in court.",
        "Subjective delivery schedules ('post-festival dispatch') fail statutory certainty tests.",
        "Pact identifies indeterminate phrases in communication transcripts and replaces them with calendar-locked terms.",
        "Contractual certainty eliminates litigation risks prior to consignment departure."
      ],
      statutoryBacking: "Section 29, Indian Contract Act, 1872: Agreements, the meaning of which is not certain, or capable of being made certain, are void. Uncertainty as to subject-matter or price prevents formation of a valid contract.",
      sampleClause: "Definite Commercial Terms: The total consideration under this contract is strictly INR [Amount] inclusive of applicable taxes. Consignment delivery must occur on or before [DD/MM/YYYY] at [Registered Godown Address]. All informal terms are superseded by this schedule.",
      actionSteps: [
        "Replace phrases like 'send payment soon' with definitive calendar-based settlement dates.",
        "Substitute 'standard quality' with explicit technical grades, GSM metrics, or signed sample identifiers.",
        "Utilize automated ambiguity analysis to resolve open commercial variables prior to execution."
      ]
    }
  },
  {
    id: "edition-blame-the-bot-collection",
    title: "The Systemic Receivable Protocol",
    date: "AUG 2026",
    subtitle: "Recovering outstanding dues through compliance-driven automated notices without damaging trade relations.",
    category: "Receivable Tactics",
    readTime: "3 min read",
    statute: "MSMED §15 Statutory Compliance",
    portalName: "MSME Dispute Redressal",
    href: "https://msme.gov.in",
    color: "#16277a",
    foil: "#faf7ee",
    fullArticle: {
      overview: "Small business trade frequently struggles with debt collection due to interpersonal friction. The systemic protocol shifts communication from personal demands to objective statutory compliance reconciliation mandated by MSMED regulations.",
      keyTakeaways: [
        "Frames overdue follow-ups as standard statutory compliance reviews rather than personalized pressure.",
        "Preserves commercial goodwill while systematically enforcing payment timelines.",
        "Utilizes structured multi-phase notifications: Informational Notice -> Statutory Due Warning -> Legal Demand.",
        "Accelerates receivable realization cycles while maintaining counterparty relations."
      ],
      statutoryBacking: "Section 15, MSMED Act 2006: Invoices flagged by automated ledger systems must be settled within the statutory limit to comply with mandatory corporate disclosure audits.",
      sampleClause: "Automated Ledger Reconciliation: 'Our automated compliance system has scheduled invoice #204 for regulatory reconciliation pursuant to Section 15 of the MSMED Act. Please authorize NEFT clearance today to avoid automated interest computation.'",
      actionSteps: [
        "Establish automated notifications on Day 15, Day 30, and Day 42 via official channels.",
        "Frame outstanding balances within statutory audit and tax reconciliation parameters.",
        "Provide verified account settlement and banking details directly within each notice."
      ]
    }
  },
  {
    id: "edition-eway-bill-transit-safety",
    title: "GST e-Way Bill & Transit Protection",
    date: "AUG 2026",
    subtitle: "Safeguarding consignments, managing Part A/B compliance, and establishing conclusive proof of delivery.",
    category: "Logistics & Compliance",
    readTime: "5 min read",
    statute: "CGST Rules 2017 Rule 138",
    portalName: "GST e-Way Bill Portal",
    href: "https://ewaybillgst.gov.in",
    color: "#25252a",
    foil: "#efe8d4",
    fullArticle: {
      overview: "Physical proof of delivery (POD) initiates the statutory 45-day payment countdown under MSME law. Without reconciled e-Way bills and valid consignment documentation, suppliers risk shipment detention and contentious receipt denials.",
      keyTakeaways: [
        "Part A captures commercial invoice data; Part B documents transport vehicle registration.",
        "Ensure the freight carrier obtains an unambiguous geotagged receipt endorsement from the consignee.",
        "Route diversions or transit delays must be updated on the GST portal prior to validity expiry.",
        "Matching digital delivery receipts with the deal certificate establishes conclusive evidence of acceptance."
      ],
      statutoryBacking: "Rule 138, Central Goods and Services Tax Rules, 2017: Every registered person causing movement of goods exceeding fifty thousand rupees shall generate an e-Way bill prior to commencement of movement.",
      sampleClause: "Consignment Acceptance Clause: Risk of transit transfers upon physical delivery at destination godown. Consignee must register written defects within 48 hours of unloading; lack of notification constitutes full statutory acceptance.",
      actionSteps: [
        "Verify recipient GSTIN on the e-Way bill against registered trade profiles.",
        "Obtain clear photographs of the stamped lorry receipt immediately following unloading.",
        "Record the unique e-Way bill reference directly within the digital contract file."
      ]
    }
  },
  {
    id: "edition-zero-default-credit-terms",
    title: "Zero-Default Credit Structuring",
    date: "JUL 2026",
    subtitle: "Structuring advance requirements, milestone releases, and deemed acceptance clauses for job-work.",
    category: "Financial Structuring",
    readTime: "4 min read",
    statute: "Reserve Bank of India TReDS Guidelines",
    portalName: "RBI MSME Guidelines",
    href: "https://www.rbi.org.in",
    color: "#3a3a40",
    foil: "#dce4ff",
    fullArticle: {
      overview: "Unsecured trade credit without milestone structure is a leading cause of liquidity failure. Structuring orders into tiered milestones (Advance, Dispatch Proof, Inspection Window) protects working capital and limits financial exposure.",
      keyTakeaways: [
        "Require advance deposits for custom manufacturing or non-standard raw material sourcing.",
        "Tie secondary payment releases directly to e-Way bill generation and verified dispatch slips.",
        "Implement a seven-day deemed acceptance clause to prevent indefinite inspection delays.",
        "Utilize TReDS institutional factoring for institutional discounting of accepted receivables."
      ],
      statutoryBacking: "Section 2(b), MSMED Act, 2006: Appointed day means the day immediately following the expiry of fifteen days from the acceptance or deemed acceptance of any goods by a buyer from a supplier.",
      sampleClause: "Deemed Acceptance Terms: The buyer shall inspect delivered goods within seven calendar days of delivery. In the absence of written defect notice with photographic evidence within said period, the goods shall be deemed accepted unconditionally.",
      actionSteps: [
        "Incorporate a 30% advance clause into all non-standard manufacturing quotations.",
        "Insert the seven-day deemed acceptance clause into standard invoice footers.",
        "Incentivize rapid settlement through early payment cash discount structures."
      ]
    }
  },
  {
    id: "edition-summary-arbitration-guide",
    title: "Fast-Track Summary Arbitration",
    date: "JUL 2026",
    subtitle: "Resolving commercial claims under Section 29B within six months without traditional civil court backlogs.",
    category: "Dispute Resolution",
    readTime: "5 min read",
    statute: "Arbitration & Conciliation Act 1996 §29B",
    portalName: "India Arbitration Portal",
    href: "https://arbitrationindia.org",
    color: "#4040ff",
    foil: "#faf7ee",
    fullArticle: {
      overview: "Section 29B of the Arbitration and Conciliation Act provides for a Fast Track Procedure allowing commercial disputes to be resolved by a sole arbitrator within six months, relying primarily on written documents without multi-year oral examination delays.",
      keyTakeaways: [
        "Fast track summary arbitration resolves disputes in 90 to 180 days.",
        "Arbitral awards carry identical legal execution authority as civil court decrees under Section 36.",
        "Hearings may be conducted entirely online through approved digital platforms.",
        "A clear arbitration agreement prevents counterparties from initiating obstructive multi-jurisdictional litigation."
      ],
      statutoryBacking: "Section 29B, Arbitration and Conciliation Act, 1996: The parties to an arbitration agreement may agree in writing to have their dispute resolved by fast track procedure... the award shall be made within a period of six months.",
      sampleClause: "Arbitration Clause: Any dispute arising out of this contract shall be settled pursuant to the Fast Track Procedure of Section 29B of the Arbitration and Conciliation Act, 1996 by a sole arbitrator. Seat of arbitration shall be [City], and proceedings may be conducted virtually.",
      actionSteps: [
        "Add the standard two-line summary arbitration clause to quotation and invoice footers.",
        "Designate your primary place of business as the exclusive seat of arbitration.",
        "Maintain dual-hash verified transaction records for immediate submission to the arbitrator."
      ]
    }
  }
];

export const defaultNewsletterBooks: NewsletterBookshelfItem[] = MSME_BUSINESS_BOOKS;

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function luminance(hex: string) {
  const color = Number.parseInt(hex.slice(1), 16);
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return (
    channel((color >> 16) & 255) * 0.2126 +
    channel((color >> 8) & 255) * 0.7152 +
    channel(color & 255) * 0.0722
  );
}

function deriveLayout(items: NewsletterBookshelfItem[]) {
  let cursor = 0;
  return items.map<BookLayout>((item) => {
    const random = seeded(hash(item.id));
    const fallbackColor = PALETTE[Math.floor(random() * PALETTE.length)]!;
    const width = 0.36 + random() * 0.24;
    const bookHeight = 3.65 + (random() * 2 - 1) * 0.22;
    const color = item.color ?? fallbackColor;
    const foil =
      item.foil ?? (luminance(color) < 0.5 ? "#f2ead8" : "#3030ff");
    if (random() < 0.14) cursor += 0.2;
    const x = cursor + width / 2;
    cursor += width + 0.075;
    return {
      ...item,
      x,
      width,
      bookHeight,
      depth: bookHeight * 0.67,
      motif: Math.floor(random() * 8),
      color,
      foil,
    };
  });
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawMotif(
  context: CanvasRenderingContext2D,
  motif: number,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  context.save();
  context.translate(x + size / 2, y + size / 2);
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = Math.max(2, size * 0.035);

  if (motif === 0) {
    for (let index = -2; index <= 2; index += 1) {
      context.beginPath();
      context.arc(0, 0, size * (0.12 + index * 0.035), 0, Math.PI * 2);
      context.stroke();
    }
  } else if (motif === 1) {
    context.rotate(Math.PI / 4);
    for (let index = -1; index <= 1; index += 1) {
      context.strokeRect(
        -size * (0.24 + index * 0.055),
        -size * (0.24 + index * 0.055),
        size * (0.48 + index * 0.11),
        size * (0.48 + index * 0.11),
      );
    }
  } else if (motif === 2) {
    for (let index = 0; index < 6; index += 1) {
      context.rotate(Math.PI / 3);
      roundedRect(context, -size * 0.045, -size * 0.36, size * 0.09, size * 0.28, size * 0.04);
      context.fill();
    }
    context.beginPath();
    context.arc(0, 0, size * 0.11, 0, Math.PI * 2);
    context.fill();
  } else if (motif === 3) {
    context.beginPath();
    for (let index = 0; index < 12; index += 1) {
      const radius = index % 2 ? size * 0.17 : size * 0.35;
      const angle = -Math.PI / 2 + (index * Math.PI) / 6;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.closePath();
    context.stroke();
  } else if (motif === 4) {
    for (let row = -2; row <= 2; row += 1) {
      for (let column = -2; column <= 2; column += 1) {
        if ((row + column) % 2 === 0) {
          context.beginPath();
          context.arc(column * size * 0.13, row * size * 0.13, size * 0.035, 0, Math.PI * 2);
          context.fill();
        }
      }
    }
  } else if (motif === 5) {
    for (let index = -2; index <= 2; index += 1) {
      context.beginPath();
      context.moveTo(-size * 0.34, index * size * 0.12);
      context.bezierCurveTo(
        -size * 0.12,
        index * size * 0.12 - size * 0.11,
        size * 0.12,
        index * size * 0.12 + size * 0.11,
        size * 0.34,
        index * size * 0.12,
      );
      context.stroke();
    }
  } else if (motif === 6) {
    context.beginPath();
    context.moveTo(0, -size * 0.37);
    context.lineTo(size * 0.34, size * 0.28);
    context.lineTo(-size * 0.34, size * 0.28);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.arc(0, size * 0.02, size * 0.11, 0, Math.PI * 2);
    context.fill();
  } else {
    context.rotate(Math.PI / 4);
    context.fillRect(-size * 0.035, -size * 0.36, size * 0.07, size * 0.72);
    context.fillRect(-size * 0.36, -size * 0.035, size * 0.72, size * 0.07);
    context.beginPath();
    context.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();
}

function addTexture(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed: number,
) {
  const image = context.getImageData(0, 0, width, height);
  const random = seeded(seed);
  for (let offset = 0; offset < image.data.length; offset += 4) {
    const noise = (random() - 0.5) * 5;
    image.data[offset] = Math.max(0, Math.min(255, image.data[offset]! + noise));
    image.data[offset + 1] = Math.max(0, Math.min(255, image.data[offset + 1]! + noise));
    image.data[offset + 2] = Math.max(0, Math.min(255, image.data[offset + 2]! + noise));
  }
  context.putImageData(image, 0, 0);
}

function drawClothWeave(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed: number,
) {
  const random = seeded(seed);
  context.save();
  context.lineCap = "round";

  context.globalCompositeOperation = "multiply";
  for (let x = 0.5; x < width; x += 3) {
    context.strokeStyle = `rgba(18, 16, 14, ${0.03 + random() * 0.035})`;
    context.lineWidth = 0.35 + random() * 0.3;
    context.beginPath();
    context.moveTo(x + (random() - 0.5) * 0.5, 0);
    context.lineTo(x + (random() - 0.5) * 0.5, height);
    context.stroke();
  }

  context.globalCompositeOperation = "screen";
  for (let y = 0.5; y < height; y += 3) {
    context.strokeStyle = `rgba(255, 248, 232, ${0.035 + random() * 0.03})`;
    context.lineWidth = 0.3 + random() * 0.25;
    context.beginPath();
    context.moveTo(0, y + (random() - 0.5) * 0.5);
    context.lineTo(width, y + (random() - 0.5) * 0.5);
    context.stroke();
  }

  context.globalCompositeOperation = "overlay";
  for (let index = 0; index < Math.floor((width * height) / 850); index += 1) {
    const x = random() * width;
    const y = random() * height;
    const length = 3 + random() * 13;
    context.strokeStyle = `rgba(255, 255, 255, ${0.035 + random() * 0.055})`;
    context.lineWidth = 0.35 + random() * 0.4;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + (random() - 0.5) * 2, y + length);
    context.stroke();
  }

  context.globalCompositeOperation = "source-over";
  const edgeShade = context.createLinearGradient(0, 0, width, 0);
  edgeShade.addColorStop(0, "rgba(0,0,0,.16)");
  edgeShade.addColorStop(0.045, "rgba(0,0,0,.025)");
  edgeShade.addColorStop(0.5, "rgba(255,255,255,.025)");
  edgeShade.addColorStop(0.955, "rgba(0,0,0,.025)");
  edgeShade.addColorStop(1, "rgba(0,0,0,.18)");
  context.fillStyle = edgeShade;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function paperTexture(book: BookLayout) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 768;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const random = seeded(hash(`${book.id}-paper`));

  context.fillStyle = "#eee9dc";
  context.fillRect(0, 0, canvas.width, canvas.height);
  addTexture(context, canvas.width, canvas.height, hash(`${book.id}-paper-noise`));

  for (let y = 0.5; y < canvas.height; y += 2) {
    const warm = Math.floor(116 + random() * 35);
    context.strokeStyle = `rgba(${warm}, ${warm - 6}, ${warm - 17}, ${0.09 + random() * 0.1})`;
    context.lineWidth = random() > 0.94 ? 1 : 0.42;
    context.beginPath();
    context.moveTo((random() - 0.5) * 4, y);
    context.bezierCurveTo(
      canvas.width * 0.33,
      y + (random() - 0.5) * 0.8,
      canvas.width * 0.66,
      y + (random() - 0.5) * 0.8,
      canvas.width + (random() - 0.5) * 4,
      y,
    );
    context.stroke();
  }

  for (let x = 0.5; x < canvas.width; x += 4) {
    context.strokeStyle = `rgba(124, 103, 72, ${0.025 + random() * 0.04})`;
    context.lineWidth = 0.35;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + (random() - 0.5) * 1.5, canvas.height);
    context.stroke();
  }

  for (let index = 0; index < 170; index += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    context.fillStyle = `rgba(112, 91, 59, ${0.025 + random() * 0.055})`;
    context.fillRect(x, y, 0.5 + random() * 1.2, 0.5 + random() * 2.5);
  }

  const edgeShade = context.createLinearGradient(0, 0, canvas.width, 0);
  edgeShade.addColorStop(0, "rgba(96,72,42,.2)");
  edgeShade.addColorStop(0.08, "rgba(138,112,72,.035)");
  edgeShade.addColorStop(0.5, "rgba(255,255,255,.16)");
  edgeShade.addColorStop(0.92, "rgba(138,112,72,.035)");
  edgeShade.addColorStop(1, "rgba(96,72,42,.18)");
  context.fillStyle = edgeShade;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function coverTexture(book: BookLayout, brand: string, face: "cover" | "spine") {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = face === "cover" ? 512 : 112;
  canvas.height = 768;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = book.color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  addTexture(
    context,
    canvas.width,
    canvas.height,
    hash(`${book.id}-${face}-noise`),
  );
  drawClothWeave(
    context,
    canvas.width,
    canvas.height,
    hash(`${book.id}-${face}-weave`),
  );
  context.fillStyle = book.foil;
  context.strokeStyle = book.foil;
  context.textBaseline = "top";
  context.shadowColor = "rgba(0, 0, 0, .3)";
  context.shadowBlur = 1.4;
  context.shadowOffsetX = 0.8;
  context.shadowOffsetY = 1.1;

  if (face === "cover") {
    const margin = 58;
    context.font = "500 21px ui-monospace, SFMono-Regular, monospace";
    context.fillText(book.date, margin, 58);
    context.font = "700 48px Georgia, serif";
    const words = book.title.split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (context.measureText(next).width < canvas.width - margin * 2 || !line) line = next;
      else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    lines.slice(0, 5).forEach((text, index) => context.fillText(text, margin, 180 + index * 56));
    context.fillRect(margin, 180 + Math.min(lines.length, 5) * 56 + 20, 92, 5);
    drawMotif(context, book.motif, 316, 510, 130, book.foil);
    context.font = "700 19px ui-monospace, SFMono-Regular, monospace";
    context.fillText(brand.toUpperCase(), margin, 690);
  } else {
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "rgba(0,0,0,.28)");
    gradient.addColorStop(0.18, "rgba(0,0,0,0)");
    gradient.addColorStop(0.82, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,.28)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = book.foil;
    context.fillRect(22, 26, canvas.width - 44, 3);
    context.fillRect(22, 704, canvas.width - 44, 3);
    context.save();
    context.translate(canvas.width / 2, 58);
    context.rotate(Math.PI / 2);
    context.font = "700 35px Georgia, serif";
    const title = book.title.length > 34 ? `${book.title.slice(0, 32)}…` : book.title;
    context.fillText(title, 0, 13);
    context.restore();
    drawMotif(context, book.motif, 29, 625, 54, book.foil);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function damp(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

const BOOK_ENTER_DURATION = 520;
const BOOK_EXIT_DURATION = 400;

function bezierCoordinate(t: number, point1: number, point2: number) {
  const inverse = 1 - t;
  return (
    3 * inverse * inverse * t * point1 +
    3 * inverse * t * t * point2 +
    t * t * t
  );
}

function easeSmoothOut(progress: number) {
  let t = progress;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    const x = bezierCoordinate(t, 0.22, 0.36);
    const inverse = 1 - t;
    const slope =
      3 * inverse * inverse * 0.22 +
      6 * inverse * t * (0.36 - 0.22) +
      3 * t * t * (1 - 0.36);
    if (Math.abs(slope) < 0.0001) break;
    t = THREE.MathUtils.clamp(t - (x - progress) / slope, 0, 1);
  }
  return bezierCoordinate(t, 1, 1);
}

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - ((-2 * progress + 2) ** 3) / 2;
}

function Book({
  book,
  index,
  hovered,
  selected,
  reducedMotion,
  cameraX,
  orbit,
  brand,
  onHover,
  onSelect,
  onDoubleClick,
}: {
  book: BookLayout;
  index: number;
  hovered: boolean;
  selected: boolean;
  reducedMotion: boolean;
  cameraX: React.MutableRefObject<number>;
  orbit: React.MutableRefObject<{ yaw: number; pitch: number }>;
  brand: string;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  onDoubleClick: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const focusFlight = useRef<{
    startedAt: number;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: number;
  } | null>(null);
  const exitFlight = useRef<{
    startedAt: number;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: number;
  } | null>(null);
  const selectedAt = useRef(0);
  const wasSelected = useRef(false);
  const textures = useMemo(
    () => ({
      cover: coverTexture(book, brand, "cover"),
      spine: coverTexture(book, brand, "spine"),
      paper: paperTexture(book),
    }),
    [book, brand],
  );

  const geometry = useMemo(
    () =>
      new RoundedBoxGeometry(
        book.width,
        book.bookHeight,
        book.depth,
        2,
        Math.min(book.width, 0.09),
      ),
    [book.bookHeight, book.depth, book.width],
  );

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((texture) => texture?.dispose());
      geometry.dispose();
    };
  }, [geometry, textures]);

  useEffect(() => {
    const node = group.current;
    if (selected && node) {
      selectedAt.current = performance.now();
      focusFlight.current = {
        startedAt: selectedAt.current,
        position: node.position.clone(),
        rotation: node.rotation.clone(),
        scale: node.scale.x,
      };
      exitFlight.current = null;
    } else if (wasSelected.current && node) {
      exitFlight.current = {
        startedAt: performance.now(),
        position: node.position.clone(),
        rotation: node.rotation.clone(),
        scale: node.scale.x,
      };
      focusFlight.current = null;
    } else {
      focusFlight.current = null;
    }
    wasSelected.current = selected;
  }, [selected]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const motion = reducedMotion ? 1000 : selected ? 7 : 11;
    const selectedFor = (performance.now() - selectedAt.current) / 1000;
    const autoYaw =
      selected && !reducedMotion
        ? Math.sin(selectedFor * 0.85) * 0.3
        : 0;
    const autoPitch =
      selected && !reducedMotion
        ? Math.sin(selectedFor * 0.55) * 0.04
        : 0;
    const targetX = selected ? cameraX.current : book.x;
    const targetY = selected
      ? 2.06
      : book.bookHeight / 2 + (hovered ? 0.25 : 0);
    const targetZ = selected ? 1.8 : hovered ? 0.22 : 0;
    const targetScale = selected ? 0.96 : 1;
    const targetRotationY = selected
      ? -Math.PI / 2 + orbit.current.yaw + autoYaw
      : 0;
    const targetRotationX = selected ? orbit.current.pitch + autoPitch : 0;

    const flight = selected ? focusFlight.current : null;
    if (flight) {
      const progress = reducedMotion
        ? 1
        : Math.min(
            1,
            (performance.now() - flight.startedAt) / BOOK_ENTER_DURATION,
          );
      const depthProgress = easeSmoothOut(progress);
      const travelProgress = easeSmoothOut(
        THREE.MathUtils.clamp((progress - 0.06) / 0.94, 0, 1),
      );
      const turnProgress = easeInOutCubic(progress);
      const depthArc = Math.sin(Math.PI * progress) * 0.12;
      node.position.set(
        THREE.MathUtils.lerp(flight.position.x, targetX, travelProgress),
        THREE.MathUtils.lerp(flight.position.y, targetY, travelProgress),
        THREE.MathUtils.lerp(flight.position.z, targetZ, depthProgress) +
          depthArc,
      );
      node.rotation.x = THREE.MathUtils.lerp(
        flight.rotation.x,
        targetRotationX,
        turnProgress,
      );
      node.rotation.y = THREE.MathUtils.lerp(
        flight.rotation.y,
        targetRotationY,
        turnProgress,
      );
      node.rotation.z = THREE.MathUtils.lerp(
        flight.rotation.z,
        0,
        turnProgress,
      );
      const scale = THREE.MathUtils.lerp(
        flight.scale,
        targetScale,
        turnProgress,
      );
      node.scale.setScalar(scale);
      if (progress >= 1) focusFlight.current = null;
    } else if (!selected && exitFlight.current) {
      const exit = exitFlight.current;
      const progress = reducedMotion
        ? 1
        : Math.min(
            1,
            (performance.now() - exit.startedAt) / BOOK_EXIT_DURATION,
          );
      const alignProgress = easeSmoothOut(progress);
      const slotProgress = easeSmoothOut(
        THREE.MathUtils.clamp((progress - 0.3) / 0.7, 0, 1),
      );
      node.position.set(
        THREE.MathUtils.lerp(exit.position.x, book.x, alignProgress),
        THREE.MathUtils.lerp(
          exit.position.y,
          book.bookHeight / 2,
          alignProgress,
        ),
        THREE.MathUtils.lerp(exit.position.z, 0, slotProgress),
      );
      node.rotation.x = THREE.MathUtils.lerp(
        exit.rotation.x,
        0,
        alignProgress,
      );
      node.rotation.y = THREE.MathUtils.lerp(
        exit.rotation.y,
        0,
        alignProgress,
      );
      node.rotation.z = THREE.MathUtils.lerp(
        exit.rotation.z,
        0,
        alignProgress,
      );
      const scale = THREE.MathUtils.lerp(exit.scale, 1, alignProgress);
      node.scale.setScalar(scale);
      if (progress >= 1) exitFlight.current = null;
    } else {
      node.position.x = damp(node.position.x, targetX, motion, delta);
      node.position.y = damp(node.position.y, targetY, motion, delta);
      node.position.z = damp(node.position.z, targetZ, motion, delta);
      node.rotation.y = damp(node.rotation.y, targetRotationY, motion, delta);
      node.rotation.x = damp(node.rotation.x, targetRotationX, motion, delta);
      const nextScale = damp(node.scale.x, targetScale, motion, delta);
      node.scale.setScalar(nextScale);
    }
  });

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(index);
  };

  const doubleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onDoubleClick(index);
  };

  return (
    <group
      ref={group}
      position={[book.x, book.bookHeight / 2, 0]}
      onPointerEnter={(event) => {
        event.stopPropagation();
        onHover(index);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={select}
      onDoubleClick={doubleClick}
    >
      <mesh geometry={geometry} renderOrder={selected ? 20 : 0}>
        <meshStandardMaterial
          attach="material-0"
          map={textures.cover ?? undefined}
          color={textures.cover ? "#ffffff" : book.color}
          roughness={0.8}
          metalness={0.015}
          bumpMap={textures.cover ?? undefined}
          bumpScale={0.007}
          depthTest={!selected}
          depthWrite={!selected}
        />
        <meshStandardMaterial
          attach="material-1"
          color={book.color}
          roughness={0.84}
          bumpMap={textures.cover ?? undefined}
          bumpScale={0.006}
          depthTest={!selected}
          depthWrite={!selected}
        />
        <meshStandardMaterial
          attach="material-2"
          map={textures.paper ?? undefined}
          color={textures.paper ? "#f1eadc" : "#e9e4d8"}
          roughness={0.93}
          bumpMap={textures.paper ?? undefined}
          bumpScale={0.008}
          depthTest={!selected}
          depthWrite={!selected}
        />
        <meshStandardMaterial
          attach="material-3"
          map={textures.paper ?? undefined}
          color={textures.paper ? "#ece3d3" : "#ddd7ca"}
          roughness={0.96}
          bumpMap={textures.paper ?? undefined}
          bumpScale={0.006}
          depthTest={!selected}
          depthWrite={!selected}
        />
        <meshStandardMaterial
          attach="material-4"
          map={textures.spine ?? undefined}
          color={textures.spine ? "#ffffff" : book.color}
          roughness={0.8}
          metalness={0.015}
          bumpMap={textures.spine ?? undefined}
          bumpScale={0.007}
          depthTest={!selected}
          depthWrite={!selected}
        />
        <meshStandardMaterial
          attach="material-5"
          map={textures.paper ?? undefined}
          color={textures.paper ? "#f3eadc" : "#e6e0d4"}
          roughness={0.94}
          bumpMap={textures.paper ?? undefined}
          bumpScale={0.007}
          depthTest={!selected}
          depthWrite={!selected}
        />
      </mesh>
    </group>
  );
}

function CameraRig({ target }: { target: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame((_, delta) => {
    camera.position.x = damp(camera.position.x, target.current, 8, delta);
    camera.lookAt(camera.position.x, 1.88, 0);
  });
  return null;
}

function Scene({
  books,
  hoveredIndex,
  selectedIndex,
  reducedMotion,
  cameraX,
  orbit,
  brand,
  onHover,
  onSelect,
  onDoubleClick,
}: {
  books: BookLayout[];
  hoveredIndex: number | null;
  selectedIndex: number | null;
  reducedMotion: boolean;
  cameraX: React.MutableRefObject<number>;
  orbit: React.MutableRefObject<{ yaw: number; pitch: number }>;
  brand: string;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  onDoubleClick: (index: number) => void;
}) {
  return (
    <>
      <CameraRig target={cameraX} />
      <ambientLight intensity={1.5} />
      <hemisphereLight args={["#ffffff", "#d7dce8", 1.2]} />
      <directionalLight position={[5, 8, 7]} intensity={2.2} />

      {books.map((book, index) => (
        <Book
          key={book.id}
          book={book}
          index={index}
          hovered={hoveredIndex === index && selectedIndex === null}
          selected={selectedIndex === index}
          reducedMotion={reducedMotion}
          cameraX={cameraX}
          orbit={orbit}
          brand={brand}
          onHover={onHover}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
        />
      ))}
    </>
  );
}

function nearestBook(books: BookLayout[], x: number) {
  let nearest = 0;
  let distance = Number.POSITIVE_INFINITY;
  books.forEach((book, index) => {
    const next = Math.abs(book.x - x);
    if (next < distance) {
      nearest = index;
      distance = next;
    }
  });
  return nearest;
}

export function NewsletterBookshelf({
  items = defaultNewsletterBooks,
  className,
  height = 430,
  brand = "Pact Law",
  onSelect,
  onOpen,
}: NewsletterBookshelfProps) {
  const books = useMemo(
    () => deriveLayout(items.length ? items : defaultNewsletterBooks),
    [items],
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [stageWidth, setStageWidth] = useState(900);
  const stageRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const cameraX = useRef(0);
  const orbit = useRef({ yaw: 0, pitch: 0 });
  const gesture = useRef<{
    mode: "pending" | "drag" | "orbit";
    x: number;
    y: number;
    startX: number;
    startedAt: number;
  } | null>(null);
  const switchTimer = useRef<number | null>(null);
  const pendingSelection = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const getBounds = useCallback(() => {
    const last = books.at(-1)?.x ?? 0;
    const aspect = stageWidth / Math.max(380, typeof height === "number" ? height : 430);
    const visibleSpan = 2 * 10 * Math.tan((35 * Math.PI) / 360) * aspect;
    const inset = visibleSpan * 0.31;
    const min = Math.min(last / 2, (books[0]?.x ?? 0) + inset);
    const max = Math.max(last / 2, last - inset);
    return max <= min ? { min: last / 2, max: last / 2, visibleSpan } : { min, max, visibleSpan };
  }, [books, height, stageWidth]);

  const moveCamera = useCallback(
    (next: number) => {
      const bounds = getBounds();
      cameraX.current = THREE.MathUtils.clamp(next, bounds.min, bounds.max);
      setCurrentIndex(nearestBook(books, cameraX.current));
    },
    [books, getBounds],
  );

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motion.matches);
    update();
    motion.addEventListener?.("change", update);
    const stage = stageRef.current;
    if (!stage) return () => motion.removeEventListener?.("change", update);
    const resize = new ResizeObserver(([entry]) => {
      if (entry) setStageWidth(entry.contentRect.width);
    });
    resize.observe(stage);
    return () => {
      resize.disconnect();
      motion.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    const bounds = getBounds();
    cameraX.current = bounds.min;
    setCurrentIndex(nearestBook(books, bounds.min));
  }, [books, getBounds]);

  useEffect(
    () => () => {
      if (switchTimer.current !== null) window.clearTimeout(switchTimer.current);
      document.body.style.cursor = "";
    },
    [],
  );

  const presentBook = useCallback(
    (index: number) => {
      moveCamera(books[index]!.x);
      orbit.current = { yaw: 0, pitch: 0 };
      setHoveredIndex(null);
      setSelectedIndex(index);
      onSelect?.(books[index]!, index);
    },
    [books, moveCamera, onSelect],
  );

  const openBook = useCallback(
    (index: number) => {
      const book = books[index];
      if (!book) return;
      if (onOpen) {
        onOpen(book, index);
        return;
      }
      const href = book.href;
      if (!href || typeof window === "undefined") return;
      try {
        const destination = new URL(href, window.location.href);
        if (destination.protocol !== "http:" && destination.protocol !== "https:") return;
        window.open(destination.href, "_blank", "noopener,noreferrer");
      } catch {
        // Fallback for internal links
      }
    },
    [books, onOpen],
  );

  const selectBook = useCallback(
    (index: number) => {
      if (suppressClick.current) return;
      if (selectedIndex === index) {
        openBook(index);
        return;
      }

      if (selectedIndex !== null) {
        pendingSelection.current = index;
        moveCamera(books[index]!.x);
        setHoveredIndex(null);
        setSelectedIndex(null);
        orbit.current = { yaw: 0, pitch: 0 };
        if (switchTimer.current !== null) window.clearTimeout(switchTimer.current);
        switchTimer.current = window.setTimeout(() => {
          const next = pendingSelection.current;
          pendingSelection.current = null;
          switchTimer.current = null;
          if (next !== null) presentBook(next);
        }, reducedMotion ? 0 : BOOK_EXIT_DURATION);
        return;
      }

      if (switchTimer.current !== null) {
        pendingSelection.current = index;
        return;
      }

      presentBook(index);
    },
    [books, moveCamera, openBook, presentBook, reducedMotion, selectedIndex],
  );

  const close = useCallback(() => {
    setSelectedIndex(null);
    orbit.current = { yaw: 0, pitch: 0 };
    stageRef.current?.focus({ preventScroll: true });
  }, []);

  const switchFocused = useCallback(
    (direction: number) => {
      if (selectedIndex === null) return;
      const next = THREE.MathUtils.clamp(selectedIndex + direction, 0, books.length - 1);
      if (next !== selectedIndex) {
        selectBook(next);
      }
    },
    [books.length, selectBook, selectedIndex],
  );

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button, a")) return;
    gesture.current = {
      mode: "pending",
      x: event.clientX,
      y: event.clientY,
      startX: event.clientX,
      startedAt: performance.now(),
    };
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (tooltipRef.current && rect) {
      tooltipRef.current.style.left = `${event.clientX - rect.left}px`;
      tooltipRef.current.style.top = `${event.clientY - rect.top}px`;
    }
    const active = gesture.current;
    if (!active) return;
    const dx = event.clientX - active.x;
    const dy = event.clientY - active.y;
    if (active.mode === "pending" && Math.hypot(event.clientX - active.startX, dy) > 7) {
      active.mode = selectedIndex === null ? "drag" : "orbit";
      suppressClick.current = true;
      stageRef.current?.setPointerCapture(event.pointerId);
      setHoveredIndex(null);
    }
    if (active.mode === "drag") {
      moveCamera(cameraX.current - dx * 0.0085);
    } else if (active.mode === "orbit") {
      orbit.current.yaw = THREE.MathUtils.clamp(orbit.current.yaw + dx * 0.006, -0.62, 0.62);
      orbit.current.pitch = THREE.MathUtils.clamp(orbit.current.pitch + dy * 0.004, -0.28, 0.28);
    }
    active.x = event.clientX;
    active.y = event.clientY;
  };

  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (stageRef.current?.hasPointerCapture(event.pointerId)) {
      stageRef.current.releasePointerCapture(event.pointerId);
    }
    gesture.current = null;
    window.requestAnimationFrame(() => {
      suppressClick.current = false;
    });
  };

  const selectedBook = selectedIndex === null ? null : books[selectedIndex];
  const hovered = hoveredIndex === null ? null : books[hoveredIndex];
  const bounds = getBounds();

  return (
    <section
      className={cn(
        "relative isolate w-full max-w-4xl mx-auto overflow-hidden bg-neutral-50/90 text-[#171717] rounded-2xl border border-neutral-200/90 shadow-xs [--shelf-accent:#171717] transition-all",
        className,
      )}
      style={{ height } as CSSProperties}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-label={
          selectedBook
            ? `${selectedBook.title} focused. Drag to rotate or double-click to read.`
            : `Interactive MSME Business Library with ${books.length} editions`
        }
        className="relative h-full w-full touch-pan-y overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onPointerLeave={() => {
          gesture.current = null;
          setHoveredIndex(null);
        }}
        onWheel={(event) => {
          if (selectedIndex !== null) return;
          const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
          if (horizontal || event.shiftKey) {
            event.preventDefault();
            moveCamera(cameraX.current + (horizontal ? event.deltaX : event.deltaY) * 0.012);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && selectedIndex !== null) {
            event.preventDefault();
            close();
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            if (selectedIndex !== null) switchFocused(1);
            else moveCamera(cameraX.current + bounds.visibleSpan * 0.23);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            if (selectedIndex !== null) switchFocused(-1);
            else moveCamera(cameraX.current - bounds.visibleSpan * 0.23);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (selectedIndex === null) selectBook(currentIndex);
            else openBook(selectedIndex);
          }
        }}
      >
        <Canvas
          camera={{ fov: 35, near: 0.1, far: 60, position: [cameraX.current, 2.3, 8.8] }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onPointerMissed={() => {
            if (selectedIndex !== null) close();
          }}
        >
          <Scene
            books={books}
            hoveredIndex={hoveredIndex}
            selectedIndex={selectedIndex}
            reducedMotion={reducedMotion}
            cameraX={cameraX}
            orbit={orbit}
            brand={brand}
            onHover={setHoveredIndex}
            onSelect={selectBook}
            onDoubleClick={openBook}
          />
        </Canvas>

        {/* Clean Hover Tooltip */}
        <div
          ref={tooltipRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-20 max-w-[280px] -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-lg bg-neutral-900/90 backdrop-blur-sm px-3 py-1.5 font-mono text-[11px] leading-4 text-white shadow-md transition-opacity duration-150 border border-neutral-800",
            hovered && selectedIndex === null ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="font-sans font-bold text-xs text-white flex items-center gap-1.5">
            <span>{hovered?.title}</span>
          </div>
          <div className="flex items-center justify-between gap-3 mt-0.5 text-[10px] text-neutral-400">
            <span>{hovered?.statute}</span>
            <span className="font-mono text-neutral-300">{hovered?.date}</span>
          </div>
        </div>

        {/* Selected Book Overlay Pill */}
        {selectedBook ? (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-white/95 border border-neutral-300/80 shadow-lg rounded-xl px-4 py-2.5 max-w-[94%] sm:max-w-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-neutral-700">
                  {selectedBook.statute}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {selectedBook.readTime}
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                {selectedBook.title}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => openBook(selectedIndex!)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
              >
                <span>Read Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={close}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                title="Return book (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-xs border border-neutral-200 rounded-full px-3.5 py-1 text-[11px] font-mono text-neutral-500 pointer-events-none">
            <span>Click book to inspect • Double-click to open guide</span>
          </div>
        )}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Professional Editorial Reader Modal for Small Business Legal Articles
// (Clean, High-End Law Firm Minimalist Aesthetic - Zero Emojis, Zero Colored Boxes)
// -----------------------------------------------------------------------------
export function SmallBusinessArticleModal({
  book,
  isOpen,
  onClose,
  onListenAudio,
}: {
  book: NewsletterBookshelfItem | null;
  isOpen: boolean;
  onClose: () => void;
  onListenAudio?: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !book) return null;

  const article = book.fullArticle;

  const handleCopyClause = () => {
    if (article?.sampleClause) {
      navigator.clipboard.writeText(article.sampleClause);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-2xl bg-white border border-neutral-200 shadow-xl flex flex-col text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Clean Minimalist Header (No Green Box, No Blue Pills) */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-start justify-between gap-4 bg-neutral-50/60">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-600 font-semibold mb-1">
              {book.category} • {book.statute} • {book.readTime || "4 min read"}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
              {book.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
              {book.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onListenAudio && article && (
              <button
                type="button"
                onClick={() => onListenAudio(`${book.title}. ${article.overview}`)}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
                title="Listen to audio overview"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body (Zero Emojis, Zero Colored Boxes) */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-neutral-800 leading-relaxed font-sans">
          
          {/* Executive Summary */}
          {article?.overview && (
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                Executive Summary
              </h3>
              <p className="text-neutral-700 leading-relaxed text-xs sm:text-sm">{article.overview}</p>
            </div>
          )}

          {/* Key Strategic Takeaways */}
          {article?.keyTakeaways && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                Key Strategic Takeaways
              </h3>
              <div className="space-y-2">
                {article.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white border border-neutral-200 text-xs sm:text-sm flex items-start gap-3">
                    <span className="font-mono text-[11px] font-bold text-neutral-500 shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <span className="text-neutral-700 leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statutory Authority Blockquote (No Amber Box) */}
          {article?.statutoryBacking && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                Statutory Legal Authority
              </h3>
              <blockquote className="border-l-2 border-neutral-900 pl-3.5 py-1 text-xs sm:text-sm font-serif italic text-neutral-700 leading-relaxed">
                "{article.statutoryBacking}"
              </blockquote>
            </div>
          )}

          {/* Sample Agreement Clause Template */}
          {article?.sampleClause && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                  Sample Contract Clause
                </h3>
                <button
                  type="button"
                  onClick={handleCopyClause}
                  className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-xs font-mono font-semibold text-neutral-800 flex items-center gap-1.5 transition-colors border border-neutral-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neutral-900" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Copy Clause</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-xs leading-relaxed border border-neutral-800 selection:bg-neutral-700">
                {article.sampleClause}
              </div>
            </div>
          )}

          {/* Action Checklist */}
          {article?.actionSteps && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                Action Checklist
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-neutral-700 pl-0.5">
                {article.actionSteps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-neutral-800">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

        </div>

        {/* Clean Neutral Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-500 font-mono">
            Pact Statutory Reference • Indian MSME Compliance
          </div>

          <div className="flex items-center gap-2">
            {book.href && (
              <a
                href={book.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>Visit {book.portalName || "Official Portal"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
