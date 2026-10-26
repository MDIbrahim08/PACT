# PACT: Commercial Contract and Electronic Evidence Notary System

<p align="right"><img src="public/report-assets/logo.png" alt="PACT Official Logo" width="80" height="80" style="border-radius: 8px;" /></p>

### Srujana Tech Fest 2026 | National Software Hackathon
### Official Hackathon Track: Legal Services (Theme Code: LS-06)
*Document Classification: Final Detailed Project Report (Non-Technical & Compliance Edition)*

---

## Document Metadata

- *Project Name:* Project PACT (Commercial Contract and Electronic Evidence System)
- *Team Name:* Team Agentics
- *Team Members:* Mohammed Ibrahim (Team Lead), Prabhanjan More (Co-Developer)
- *Official Track:* Legal Services (Code: LS-06)
- *Submission Target:* 10:00 AM, October 26, 2026
- *Target Demographic:* 63+ Million Indian Micro, Small, and Medium Enterprises (MSMEs)
- *Core Statutory Framework:* Indian Contract Act, 1872; Bharatiya Sakshya Adhiniyam, 2023; MSMED Act, 2006; Information Technology Act, 2000
- *Public Repository:* https://github.com/MDIbrahim08/PACT

---

## Executive Summary

In India, over sixty-three million Micro, Small, and Medium Enterprises (MSMEs) drive thirty percent of the national Gross Domestic Product and approximately forty-five percent of overall manufacturing exports. Despite their economic centrality, more than ninety percent of informal business-to-business transactions are negotiated casually through WhatsApp text messages, phone calls, and regional voice recordings. 

Small enterprise owners consistently avoid traditional multi-page legal contracts. Formal legal drafting requires engaging attorneys, costs between three thousand and fifteen thousand rupees per deal, demands formal English literacy, and breaks social relationships because requesting a signed legal contract implies personal distrust. Consequently, traders operate on informal handshakes. When buyers delay or default on payments, small suppliers lack admissible documentation to enforce claims before judicial magistrates or statutory arbitration councils. According to official estimates, Indian MSMEs suffer from over 10.7 Lakh Crore Rupees in delayed payments and locked working capital.

Project PACT bridges this divide by providing an automated, neutral commercial notary. Operating directly within the merchant's natural communication workflow across web, mobile, and WhatsApp, PACT:
1. Ingests conversational trade negotiations in vernacular speech or text.
2. Extracts commercial terms into standardized deal parameters.
3. Audits agreements against the five statutory pillars of Section 10 of the Indian Contract Act, 1872.
4. Identifies ambiguous clauses that would render agreements void under Section 29.
5. Enforces statutory credit limits and compound interest penalties under Section 15 and Section 16 of the MSMED Act, 2006.
6. Seals contracts with dual-node SHA-256 cryptographic digests, producing court-admissible electronic evidence certificates strictly compliant with Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023.
7. Dispatches clear, polite statutory summaries directly into standard WhatsApp chats without requiring counterparties to install any new application.

---

## Official Srujana 2026 Evaluation Rubric Alignment Matrix

| Evaluation Criterion | Weight | Assessment Objective | Project PACT Implementation and Delivery |
|---|---|---|---|
| 1. Problem Statement | 15% | Alignment with problem, depth of understanding, target users, commercial constraints. | Directly tackles India's 10.7 Lakh Crore Rupee MSME delayed payment crisis; addresses the "Trust Paradox" and Section 63(4) BSA screenshot inadmissibility across 63M+ merchants. |
| 2. Strategic & Technical Approach | 20% | Architecture, system design, data privacy, and feasibility. | Dual-node cryptographic architecture (Client WebCrypto + Server HMAC-SHA256), timing-safe verification, zero central data retention, and low-latency API gateway. |
| 3. Implementation & Execution | 25% | Prototype execution, code completeness, functional reliability, and testing. | Production Next.js and TypeScript platform; deterministic Section 10 and Section 29 statutory engines; multilingual speech pipelines; automated WhatsApp routing; live tamper sandbox. |
| 4. Presentation & Clarity | 20% | Communication, storytelling, demo quality, and structural clarity. | Clear non-technical presentation, live interactive demonstration, comprehensive test scenarios, and plain-language legal reference materials. |
| 5. Viability & Impact | 20% | Real-world usefulness, business model, adoption feasibility, and risk management. | Zero counterparty friction (uses standard WhatsApp); offline capability via PWA; fractional transaction cost; scalable to millions of daily trade deals. |
| Total Score | 100% | Full Compliance with Hackathon Guidelines | Comprehensive Delivery Across All Evaluation Dimensions |

---

## Addressing Core Evaluator Inquiries

1. *What makes this useful to a real user?*
   Traditional legal platforms demand that both trading parties download software and sign complex ten-page agreements that small buyers reject. PACT functions directly within standard WhatsApp. By introducing the "Blame-the-Bot" mechanism, suppliers politely introduce compliance checks as an automated accounting requirement: *"Our automated system requires confirmation of the delivery date to generate our GST e-stamp certificate. Please confirm so the order can proceed."* This protects relationships while establishing formal enforceability.

2. *What difficult edge cases have been resolved?*
   - *Adversarial Screenshot Forgery:* Single-character or single-digit alterations in chat transcripts are detected by SHA-256 cryptographic hashing and flagged immediately as tampered.
   - *Ambiguous Settlement Promises:* Vague terms such as "we will settle accounts after festival sales" are flagged under Section 29 before goods leave the warehouse.
   - *Statutory Credit Limit Violations:* Credit terms exceeding forty-five days are automatically capped under Section 15 of the MSMED Act, with statutory compound interest calculated under Section 16.
   - *Offline Warehouse Environments:* The system operates in zero-connectivity godowns through Progressive Web Application caching and client-side cryptography.

3. *How does this differ from generic artificial intelligence chatbots?*
   Generic chatbots hallucinate legal sections, provide unverified advice, and produce outputs with zero judicial admissibility. PACT uses artificial intelligence exclusively for natural language speech parsing, while all legal compliance checks, statutory calculations, and evidence certificates are executed by deterministic algorithmic rules with zero hallucination.

4. *Is the platform demonstrated live?*
   Yes. The platform operates end-to-end with live speech recording, automated WhatsApp deep-linking, real-time e-stamp generation, and an interactive mathematical tamper detection sandbox.

---

## 1. Selected Problem Statement

*Official Track:* Legal Services (Code: LS-06)

*Problem Statement Title:* Transforming Informal Commercial Communication (WhatsApp and Voice Notes) into Legally Enforceable, Court-Admissible Contracts for Indian MSMEs under the Indian Contract Act, 1872 and Bharatiya Sakshya Adhiniyam, 2023.

The selected problem addresses three core systemic challenges:
- *Contractual Informality:* Small merchants conduct high-velocity wholesale business over casual chat channels because formal contracts are too slow, costly, and socially abrasive.
- *Evidentiary Inadmissibility:* When payments default, chat screenshots are rejected as unverified hearsay under Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023.
- *Commercial Power Imbalance:* Small vendors lack leverage to hold institutional buyers to agreed credit periods, leading to crippling capital lockups.

---

## 2. Problem Understanding and Context

### Target Beneficiaries
- *Manufacturing and Wholesale MSME Proprietors:* Textile weavers in Surat, brassware fabricators in Moradabad, component machinists in Rajkot, packaging printers in Delhi, and spice wholesalers in Unjha.
- *Commercial Characteristics:* High daily transaction frequency (five to fifty deals daily), regional language preference (Hindi, Gujarati, Marathi, Tamil, Kannada), relationship-based negotiation, and reliance on trade credit.

### The Problem in Practice
In wholesale trade, an order is placed with a brief voice note: *"Send five hundred units on Monday, payment will be settled in thirty days."* If the buyer later claims the agreed price was lower or refuses to pay, the seller faces critical legal hurdles:
- Under Section 29 of the Indian Contract Act, 1872, agreements with uncertain terms cannot be enforced.
- Under Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023, electronic evidence requires a certificate confirming system integrity, lawful custody, and non-tampering. Raw screenshots fail this requirement.
- Small enterprises cannot afford litigation expenses of twenty to fifty thousand rupees for claims of one to five lakh rupees.

---

## 3. Proposed Solution

Project PACT delivers an automated commercial notary that functions without changing user habits:
- *Conversational Ingestion:* Accepts voice recordings or pasted text from messaging applications.
- *Five-Pillar Statutory Audit:* Verifies offer, acceptance, lawful consideration, competency of parties, free consent, and lawful object under Section 10 of the Indian Contract Act, 1872.
- *Ambiguity Radar:* Pinpoints missing terms and prompts the seller to clarify them before finalizing the transaction.
- *MSMED Act Protection:* Applies Section 15 statutory payment rules (mandatory forty-five-day limit) and calculates Section 16 compound interest penalties.
- *Cryptographic Evidence Sealing:* Creates an unalterable SHA-256 digital fingerprint and issues an electronic certificate compliant with Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023.
- *WhatsApp Auto-Pilot Dispatch:* Generates a pre-filled WhatsApp message containing the agreed terms and cryptographic seal for one-touch transmission to the buyer.

---

## 4. Innovation and Uniqueness

| Dimension | Conventional Legal Services | Generic AI Chatbots | Project PACT Notary |
|---|---|---|---|
| User Experience | Multi-page contracts; formal signatures | Long text summaries in chatbot UI | Polite WhatsApp summaries with verification seals |
| Adoption Friction | High; buyers refuse to sign formal contracts | Moderate; requires external software | Zero; buyers use their existing WhatsApp app |
| Legal Admissibility | High, but requires lawyer affidavits in court | None; uncertified text has no standing | Built-in Section 63(4) BSA cryptographic certification |
| Risk of Hallucination | Low, but prone to human drafting delays | High; invents non-existent statutes | Zero; 100% deterministic statutory logic |
| Turnaround Time | Three to seven business days | Thirty seconds (unstructured) | Under three seconds to sealed certificate |
| Cost per Transaction | Rs 3,000 to Rs 15,000 | Monthly subscription fees | Fractional serverless cost under ten paise |

---

## 5. System Workflow and Functional Architecture

The functional architecture executes through seven sequential phases:
1. *Input Capture:* The merchant speaks a brief voice note or enters conversation transcripts into the interface.
2. *Semantic Parsing:* Natural language models extract key deal entities: buyer, seller, items, quantity, rate, delivery date, and payment terms.
3. *Statutory Validation:* The extracted fields are checked against deterministic rules for Section 10 and Section 29 compliance.
4. *Credit Term Enforcement:* If credit exceeds forty-five days, the system caps the term under Section 15 of the MSMED Act, 2006 and attaches statutory interest calculations.
5. *Canonical Hashing:* Contract terms are normalized and processed through SHA-256 to generate an unalterable digital seal.
6. *Certificate Assembly:* A formal electronic evidence certificate is created with device details, timestamps, and statutory declarations under the Fourth Schedule of BSA, 2023.
7. *WhatsApp Delivery and Verification:* The merchant dispatches the summary to the buyer's WhatsApp number with a single touch, with public verification available on an independent portal.

---

## 6. Operational and Technical Feasibility

- *Zero Counterparty Installation:* Buyers receive agreements in standard WhatsApp without registering, logging in, or downloading apps.
- *Progressive Web Application Support:* Operates in wholesale godowns with poor internet through local service worker caching and client-side cryptography.
- *Privacy and Zero Data Retention:* Private transaction details and customer lists are never stored on central database servers; all processing is executed in session memory and client-side storage.
- *Minimal Cost Footprint:* Built on lightweight serverless architecture, keeping per-transaction computing costs under ten paise.

---

## 7. Implementation Details and Core Modules

1. *Multilingual Speech Ingestion Module:* Transcribes regional voice notes in real time, supporting Hindi, Marathi, Gujarati, and Indian English dialects.
2. *Deterministic Statutory Auditor:* Rule-based engine verifying Section 10 and Section 29 compliance without relying on non-deterministic generative text.
3. *MSME Credit Protection Sentinel:* Implements Section 15 credit period limits and Section 16 interest penalty formulas automatically.
4. *Evidence Notarization Engine:* Generates SHA-256 cryptographic hashes and formats Section 63(4) BSA compliance certificates.
5. *WhatsApp Auto-Pilot Dispatcher:* Translates transaction parameters into direct deep-links that open WhatsApp with verified statutory text.
6. *Interactive Tamper Sandbox:* Interactive tool allowing judges and merchants to modify records and observe immediate cryptographic mismatch detection.
7. *MSME Statutory Knowledge Library:* Accessible legal resource explaining eight fundamental commercial statutes in plain language.

---

## 8. Completed Features and Functional Capabilities

- Real-time vernacular speech recording and transcription.
- Real-time contract validity scoring from 0 to 100 percent.
- Automatic ambiguity detection with polite clarification suggestions.
- Simulated non-judicial e-stamp certificate generation modeled after official SHCIL formats.
- Direct WhatsApp auto-pilot routing to specific contacts.
- Interactive mathematical tamper verification sandbox.
- Responsive cross-platform deployment for desktop and mobile devices.
- User-controlled sandbox reset and complete uninstallation.

---

## 9. Testing, Validation and Verification Results

| Test ID | Test Scenario | Statutory Standard | Observed System Behavior | Verification Status |
|---|---|---|---|---|
| TC-01 | Complete wholesale order for 10,000 packaging units at Rs 25. | Indian Contract Act Section 10 | All five pillars identified; 100% validity score; e-stamp issued. | Verified |
| TC-02 | Buyer demands 90-day credit term. | MSMED Act 2006 Section 15 | Flagged illegal credit term; capped at 45 days with interest notice. | Verified |
| TC-03 | Conversation states: "We will settle payment after delivery." | Indian Contract Act Section 29 | Ambiguity radar triggers; flags uncertain date; prompts clarification. | Verified |
| TC-04 | Single-digit alteration in invoice amount after certificate creation. | BSA 2023 Section 63(4) | SHA-256 hash mismatch detected; displays red Tamper alert. | Verified |
| TC-05 | Voice command: "Send payment notice to Salman Khan." | Telephony Deep-Linking Protocol | Resolves contact number; launches WhatsApp with pre-filled notice. | Verified |
| TC-06 | Offline execution in warehouse environment. | W3C WebCrypto API & Service Workers | Application functions offline; generates local cryptographic hash. | Verified |

---

## 10. Utilization of Artificial Intelligence and Multi-Agent Architecture

Project PACT maintains a strict boundary between artificial intelligence and legal execution. The bot functions as a coordinated Multi-Agent System comprising eight specialized autonomous agents:

| Agent Designation | Underlying Engine | Primary Operational Responsibility | Governing Standard |
|---|---|---|---|
| Acoustic & Speech Agent | Sarvam AI (`saaras:v3`) & ElevenLabs | Ingests regional voice recordings in Hindi, Marathi, Gujarati; provides sub-350ms streaming voice feedback. | Multilingual Audio Perception |
| Conversational Parsing Agent | Google Gemini 2.5 Flash / Groq Llama-3.1 | Transforms messy trade conversations and voice notes into normalized commercial deal parameters. | Semantic Entity Extraction |
| Deterministic Statutory Agent | Custom TypeScript Rule Engine (Non-AI) | Audits agreements against the five statutory contract pillars: consent, competency, consideration, object, and certainty. | Indian Contract Act, 1872 Section 10 |
| Ambiguity Resolution Agent | Contextual Nudge Generator | Detects vague terms (e.g. payment after delivery) and drafts polite "Blame-the-Bot" clarification requests. | Indian Contract Act, 1872 Section 29 |
| Payment Protection Sentinel | Financial Rule Calculation Engine | Enforces statutory 45-day payment limits and automatically calculates 3x RBI compound interest for delayed payments. | MSMED Act, 2006 Sections 15 & 16 |
| Cryptographic Notary Agent | Node.js `crypto` (`timingSafeEqual`) & WebCrypto | Generates SHA-256 evidence digests, issues electronic certificates, and powers the Judge Tamper Sandbox. | Bharatiya Sakshya Adhiniyam, 2023 §63(4) |
| WhatsApp Auto-Pilot Agent | Telephony Protocol & MSME Directory Resolver | Resolves counterparty contacts (e.g. Salman Khan, Prabhanjan More) and launches pre-filled statutory dispatches. | Universal Telephony Protocol (`wa.me`) |
| Zero-Storage Privacy Agent | Session Memory & Sandbox Purge Controller | Guarantees zero central data retention, evaluates transactions ephemerally, and manages client install/uninstall lifecycles. | Digital Personal Data Protection Act, 2023 |

*Strict Deterministic Boundary:* No artificial intelligence model is permitted to evaluate contract validity, compute interest rates, or determine legal admissibility. All legal evaluations, statutory threshold comparisons, date validations, and cryptographic hash operations are executed by deterministic programmatic rules. This completely eliminates legal hallucinations, ensuring that every certificate generated is legally accurate and reproducible.

---

## 11. Real-World Viability and Commercial Feasibility

- *Market Size:* 63+ million Indian MSMEs executing billions of informal transactions annually.
- *Adoption Strategy:* Bottom-up adoption driven by suppliers seeking payment protection without alienating customers.
- *Monetization Models:*
  - Freemium tier for micro-enterprises conducting up to twenty transactions monthly.
  - Modest subscription (Rs 100 to Rs 200 monthly) for wholesale traders requiring automated WhatsApp routing and verified ledger management.
  - Institutional integration fees for supply chain financing platforms and trade credit insurers.

---

## 12. Potential Impact and Socio-Economic Benefits

- *Working Capital Unlocking:* Provides small vendors with verifiable proof of delivery dates to enforce claims before MSME Samadhaan facilitation councils.
- *Equitable Legal Access:* Extends enterprise-grade legal security to vernacular and non-English-speaking merchants.
- *Accelerated Judicial Resolution:* Enables arbitration councils and civil courts to resolve disputes in weeks rather than years by providing verified audit trails.

---

## 13. Challenges Faced and Solutions Implemented

- *Vernacular Ambiguity:* Resolved by implementing a two-stage pipeline that standardizes regional phrasing before statutory evaluation.
- *Counterparty Resistance:* Overcome by eliminating counterparty onboarding and delivering summaries through standard WhatsApp.
- *Admissibility Standards:* Aligned all electronic certificates with the Fourth Schedule requirements of the Bharatiya Sakshya Adhiniyam, 2023.
- *Timing Analysis Vulnerabilities:* Prevented side-channel attacks by implementing constant-time cryptographic comparison functions.

---

## 14. Future Roadmap and Strategic Expansion

- *Phase 1 (Q1 2027):* Direct integration with State Treasury digital e-stamping portals (SHCIL) for automated non-judicial stamp affixation.
- *Phase 2 (Q2 2027):* Direct integration with the Ministry of MSME Samadhaan dispute arbitration portal.
- *Phase 3 (Q3 2027):* Connectivity with Trade Receivables Discounting System (TReDS) platforms for instant invoice discounting and financing.

---

## 15. Conclusion and Team Contributions

Project PACT demonstrates that commercial legal protection can be delivered without complex legal language or administrative overhead. By combining speech processing with deterministic statutory auditing and modern cryptography, PACT provides Indian MSMEs with a practical shield against payment delays and commercial disputes.

### Team Agentics Roles and Responsibilities
- *Mohammed Ibrahim (Team Lead & Full-Stack Architect):* Overall architecture, deterministic statutory engine implementation, cryptographic evidence sealing, WhatsApp auto-pilot routing, and legal research.
- *Prabhanjan More (Co-Developer & Systems Engineer):* Multilingual speech-to-text pipeline integration, legal reference library structuring, progressive web app configuration, cross-platform client validation, and end-to-end test execution.

### Statutory References
1. The Indian Contract Act, 1872 (Act No. 9 of 1872) — Sections 10 and 29.
2. The Bharatiya Sakshya Adhiniyam, 2023 (Act No. 47 of 2023) — Section 63 and Fourth Schedule.
3. The Micro, Small and Medium Enterprises Development Act, 2006 (Act No. 27 of 2006) — Sections 15 and 16.
4. The Information Technology Act, 2000 (Act No. 21 of 2000) — Sections 4 and 10A.
