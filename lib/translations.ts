export type LanguageCode = 'en' | 'hi' | 'ta' | 'gu';

export interface TranslationStrings {
  title: string;
  tagline: string;
  badgeTheme: string;
  heroHeadline: string;
  heroSubheadline: string;
  informalDealsStat: string;
  delayedDuesStat: string;
  bsaLockStat: string;
  tabChat: string;
  tabCertificate: string;
  tabSandbox: string;
  voiceNoteHeader: string;
  autoTranscribeBadge: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  enforceabilityIndex: string;
  ambiguitiesTab: string;
  blameTheBotPhilosophy: string;
  blameTheBotDescription: string;
  courtCertificateTitle: string;
  judgeSandboxTitle: string;
  judgeSandboxSubtitle: string;
  installPwa: string;
  tamperDetected: string;
  evidenceLocked: string;
  generateStampPaper: string;
  shareViaWhatsApp: string;
  printAffidavit: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    title: "PACT",
    tagline: "Indian Contract Act 1872 (§10) • Bharatiya Sakshya Adhiniyam 2023 (§63(4))",
    badgeTheme: "LS-06 Handshake to Contract",
    heroHeadline: "Turn WhatsApp Deals into Court-Admissible Contracts",
    heroSubheadline: "Indian businesses close crores in deals over WhatsApp because formal 10-page contracts kill mutual trust. Pact extracts Section 10 pillars, clears vague terms with polite 'Blame-the-Bot' nudges, and locks evidence under BSA 2023 Section 63(4).",
    informalDealsStat: "Informal Deals on WhatsApp",
    delayedDuesStat: "Delayed MSME Dues",
    bsaLockStat: "BSA 2023 Digital Lock",
    tabChat: "1. WhatsApp Chat & Voice Ingestion",
    tabCertificate: "2. BSA 2023 Court Certificate",
    tabSandbox: "3. Judge Tamper Sandbox",
    voiceNoteHeader: "WhatsApp Voice Note / Audio Ingestion",
    autoTranscribeBadge: "AI Speech-to-Contract Active",
    pillarsTitle: "Section 10 Extraction & Ambiguity Radar",
    pillarsSubtitle: "Indian Contract Act, 1872 • Deterministic Legal Analysis",
    enforceabilityIndex: "Legal Enforceability Index",
    ambiguitiesTab: "Ambiguity Radar",
    blameTheBotPhilosophy: "“Blame-The-Bot” Negotiation Philosophy",
    blameTheBotDescription: "Indian MSMEs fear losing client trust by demanding formal contracts. Pact generates polite, automated compliance nudges that frame clarity as a software/tax requirement—protecting business relationships while locking legal certainty.",
    courtCertificateTitle: "BSA 2023 §63(4) Electronic Evidence Certificate",
    judgeSandboxTitle: "Judge Tamper-Simulation Sandbox",
    judgeSandboxSubtitle: "Test editing the deal text to observe instantaneous cryptographic avalanche failure",
    installPwa: "Install PWA",
    tamperDetected: "TAMPER DETECTED // HASH INVALID",
    evidenceLocked: "IMMUTABLE EVIDENCE LOCK // SHA-256",
    generateStampPaper: "Official Judicial Stamp Paper View",
    shareViaWhatsApp: "Share Contract on WhatsApp",
    printAffidavit: "Print / Export Court PDF",
  },
  hi: {
    title: "पैक्ट (PACT)",
    tagline: "भारतीय अनुबंध अधिनियम 1872 (§10) • भारतीय साक्ष्य अधिनियम 2023 (§63(4))",
    badgeTheme: "LS-06 जुबान से कानूनी अनुबंध",
    heroHeadline: "व्हाट्सएप चैट को बनाएं कोर्ट में मान्य कानूनी अनुबंध",
    heroSubheadline: "भारतीय व्यापारी भरोसे पर करोड़ों का व्यापार व्हाट्सएप और वॉयस नोट्स पर करते हैं, लेकिन कोर्ट में व्हाट्सएप स्क्रीनशॉट खारिज हो जाते हैं। पैक्ट धारा 10 के स्तंभों को निकालता है, अस्पष्ट शर्तों को बॉट-नज से ठीक करता है और बीएसए 2023 के तहत डिजिटल सबूत लॉक करता है।",
    informalDealsStat: "व्हाट्सएप पर अनौपचारिक सौदे",
    delayedDuesStat: "अटका हुआ MSME भुगतान",
    bsaLockStat: "BSA 2023 डिजिटल लॉक",
    tabChat: "1. व्हाट्सएप चैट और वॉयस नोट",
    tabCertificate: "2. BSA 2023 कानूनी प्रमाणपत्र",
    tabSandbox: "3. जज छेड़छाड़ (Tamper) सैंडबॉक्स",
    voiceNoteHeader: "व्हाट्सएप वॉयस नोट / ऑडियो इनपुट",
    autoTranscribeBadge: "ऑटो-ट्रांसक्राइब चालू",
    pillarsTitle: "धारा 10 अनुबंध विश्लेषण और अस्पष्टता रडार",
    pillarsSubtitle: "भारतीय अनुबंध अधिनियम, 1872 • वैधानिक कानूनी विश्लेषण",
    enforceabilityIndex: "कानूनी वैधता सूचकांक",
    ambiguitiesTab: "अस्पष्टता रडार",
    blameTheBotPhilosophy: "“दोष बॉट पर मढ़ें” बातचीत दर्शन",
    blameTheBotDescription: "व्यापारी ग्राहकों से सीधे कड़े अनुबंध मांगने में हिचकिचाते हैं। पैक्ट ऐसा संदेश देता है जैसे यह जीएसटी और ई-वे बिल सॉफ्टवेयर की कानूनी मजबूरी हो—रिश्ता भी बना रहे और सौदा भी पक्का हो।",
    courtCertificateTitle: "BSA 2023 §63(4) इलेक्ट्रॉनिक साक्ष्य प्रमाणपत्र",
    judgeSandboxTitle: "जज छेड़छाड़ परीक्षण सैंडबॉक्स",
    judgeSandboxSubtitle: "सौदा पाठ में बदलाव करके देखें कि कैसे SHA-256 हैश तुरंत लाल होकर अमान्य हो जाता है",
    installPwa: "PWA इंस्टॉल करें",
    tamperDetected: "छेड़छाड़ पकड़ी गई // हैश अमान्य",
    evidenceLocked: "सुरक्षित कानूनी लॉक // SHA-256",
    generateStampPaper: "सरकारी ई-स्टाम्प पेपर देखें",
    shareViaWhatsApp: "व्हाट्सएप पर शेयर करें",
    printAffidavit: "प्रिंट / कोर्ट PDF डाउनलोड",
  },
  ta: {
    title: "பேக்ட் (PACT)",
    tagline: "இந்திய ஒப்பந்தச் சட்டம் 1872 (§10) • பாரதிய சாட்சிய அதினியம் 2023 (§63(4))",
    badgeTheme: "LS-06 கைக்குலுக்கலில் இருந்து ஒப்பந்தத்திற்கு",
    heroHeadline: "வாட்ஸ்அப் உரையாடல்களை நீதிமன்ற செல்லுபடியாகும் ஒப்பந்தங்களாக மாற்றுங்கள்",
    heroSubheadline: "இந்திய குறுந்தொழில் நிறுவனங்கள் நம்பிக்கையின் அடிப்படையில் வாட்ஸ்அப்பில் வணிகம் செய்கின்றன. பேக்ட் தன்னிச்சையாக ஒப்பந்த விதிகளைப் பிரித்தெடுத்து, தெளிவற்ற சொற்களை சரிசெய்து, BSA 2023 பிரிவு 63(4) கீழ் டிஜிட்டல் சான்றைப் பூட்டுகிறது.",
    informalDealsStat: "வாட்ஸ்அப்பில் முறைசாரா ஒப்பந்தங்கள்",
    delayedDuesStat: "தாமதமான MSME நிலுவைத் தொகை",
    bsaLockStat: "BSA 2023 டிஜிட்டல் பூட்டு",
    tabChat: "1. வாட்ஸ்அப் அரட்டை & குரல் குறிப்பு",
    tabCertificate: "2. BSA 2023 நீதிமன்ற சான்றிதழ்",
    tabSandbox: "3. நீதிபதி சோதனைக் களம் (Tamper Sandbox)",
    voiceNoteHeader: "வாட்ஸ்அப் குரல் குறிப்பு / ஆடியோ உள்ளீடு",
    autoTranscribeBadge: "தானியங்கி டிரான்ஸ்கிரைப் செயலில் உள்ளது",
    pillarsTitle: "பிரிவு 10 ஒப்பந்தத் தூண்கள் & சந்தேக ரேடார்",
    pillarsSubtitle: "இந்திய ஒப்பந்தச் சட்டம், 1872 • சட்டபூர்வ பகுப்பாய்வு",
    enforceabilityIndex: "சட்ட அமலாக்கக் குறியீடு",
    ambiguitiesTab: "சந்தேக ரேடார்",
    blameTheBotPhilosophy: "“பாட் மீது பழியைப் போடுங்கள்” தத்துவம்",
    blameTheBotDescription: "வாடிக்கையாளர் உறவை பாதிக்காமல், ஜிஎஸ்டி மற்றும் வரி மென்பொருளின் தேவை எனக் கூறி உறுதியான தேதிகளைப் பூட்டுங்கள்.",
    courtCertificateTitle: "BSA 2023 §63(4) மின்னணு ஆதார சான்றிதழ்",
    judgeSandboxTitle: "நீதிபதி போலி ஆவண சோதனைப் பெட்டி",
    judgeSandboxSubtitle: "உரையை மாற்றும்போது SHA-256 குறியீடு உடனடியாக சிவப்பாக மாறுவதைக் கண்காணிக்கவும்",
    installPwa: "PWA ஐ நிறுவுக",
    tamperDetected: "முறைகேடு கண்டறியப்பட்டது // செல்லாது",
    evidenceLocked: "மாற்ற முடியாத ஆதாரப் பூட்டு // SHA-256",
    generateStampPaper: "அதிகாரப்பூர்வ முத்திரைத்தாள் பார்வை",
    shareViaWhatsApp: "வாட்ஸ்அப்பில் பகிரவும்",
    printAffidavit: "அச்சிடுக / PDF ஆக சேமிக்க",
  },
  gu: {
    title: "પેક્ટ (PACT)",
    tagline: "ભારતીય કરાર અધિનિયમ 1872 (§10) • ભારતીય સાક્ષ્ય અધિનિયમ 2023 (§63(4))",
    badgeTheme: "LS-06 હાથ મિલાવવાથી કાનૂની કરાર સુધી",
    heroHeadline: "વ્હોટ્સએપ ચેટ અને વોઈસ નોટ્સને કોર્ટમાં માન્ય કરાર બનાવો",
    heroSubheadline: "ભારતીય વેપારીઓ સંબંધો જાળવવા વ્હોટ્સએપ પર કરોડોનો સોદો કરે છે પરંતુ કોર્ટમાં સ્ક્રીનશૉટ રદ થાય છે. પેક્ટ કલમ 10 ના સ્તંભો કાઢીને, બોટ નજ દ્વારા સ્પષ્ટતા લાવીને અને BSA 2023 હેઠળ સુરક્ષિત કરે છે.",
    informalDealsStat: "વ્હોટ્સએપ પર અનૌપચારિક સોદા",
    delayedDuesStat: "અટવાયેલું MSME પેમેન્ટ",
    bsaLockStat: "BSA 2023 ડિજિટલ લૉક",
    tabChat: "1. વ્હોટ્સએપ ચેટ અને વૉઇસ રેકોર્ડિંગ",
    tabCertificate: "2. BSA 2023 કાનૂની સર્ટિફિકેટ",
    tabSandbox: "3. જજ ટેમ્પર (છેડછાડ) સેન્ડબોક્સ",
    voiceNoteHeader: "વ્હોટ્સએપ વૉઇસ નોટ ઇનપુટ",
    autoTranscribeBadge: "ઓટો-ટ્રાન્સક્રિપ્શન ચાલુ",
    pillarsTitle: "કલમ 10 કરાર વિશ્લેષણ અને શંકા રડાર",
    pillarsSubtitle: "ભારતીય કરાર અધિનિયમ, 1872 • કાનૂની પૃથ્થકરણ",
    enforceabilityIndex: "કાનૂની માન્યતા દર",
    ambiguitiesTab: "અસ્પષ્ટતા રડાર",
    blameTheBotPhilosophy: "“દોષ બોટ પર ઢોળો” વાર્તાલાપ શૈલી",
    blameTheBotDescription: "વેપારીઓ સંબંધ બગાડ્યા વિના GST અને ઈ-વે બિલ સોફ્ટવેરનું બહાનું કાઢીને ચોક્કસ તારીખ અને પેમેન્ટ શરતો મંજૂર કરાવી શકે છે.",
    courtCertificateTitle: "BSA 2023 §63(4) ઇલેક્ટ્રોનિક પુરાવા પ્રમાણપત્ર",
    judgeSandboxTitle: "ન્યાયાધીશ છેડછાડ પરીક્ષણ સેન્ડબોક્સ",
    judgeSandboxSubtitle: "સોદામાં એક પણ અક્ષર બદલાતા SHA-256 હેશ કેવી રીતે તાત્કાલિક લાલ થઈ જાય છે તે જુઓ",
    installPwa: "PWA ઇન્સ્ટોલ કરો",
    tamperDetected: "છેડછાડ જણાઈ // હેશ અમાન્ય",
    evidenceLocked: "અપરિવર્તનશીલ પુરાવા લૉક // SHA-256",
    generateStampPaper: "સરકારી ઈ-સ્ટેમ્પ પેપર દસ્તાવેજ",
    shareViaWhatsApp: "વ્હોટ્સએપ પર શેર કરો",
    printAffidavit: "પ્રિન્ટ / કોર્ટ PDF ડાઉનલોડ",
  },
};
