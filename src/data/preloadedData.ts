import { Protocol, Criterion, Assessment } from '../types';

export const DEFAULT_PROTOCOLS: Protocol[] = [
  {
    id: 'wep',
    abbreviation: 'WEP',
    name: 'Wired Equivalent Privacy',
    standard: 'IEEE 802.11b',
    releaseYear: 1997,
    encryptionMethod: 'RC4 stream cipher (40/64-bit and 104/128-bit key sizes) with 24-bit Initialization Vector (IV)',
    authenticationMethod: 'Open System Authentication (OSA) or Shared Key Authentication (SKA) using challenge-response handshake',
    description: 'Wired Equivalent Privacy was the earliest security algorithm defined by the IEEE 802.11 working group in 1997. It was designed to provide wireless local area networks with a level of security and privacy comparable to that of a conventional wired Ethernet network.',
    strengths: [
      'Pioneering baseline specification establishing wireless link-layer confidentiality concepts',
      'Extremely low computational footprint compatible with 1990s-era microcontrollers',
      'Universal hardware implementation and transparent operation without complex key infrastructure'
    ],
    weaknesses: [
      'Short 24-bit Initialization Vector (IV) produces rapid IV reuse/collisions under typical network throughput',
      'Linear and unkeyed CRC-32 (ICV) integrity check vulnerable to bit-flipping and packet modification',
      'Static shared master keys distributed manually with no automated session key rotation',
      'Shared Key Authentication exposes keystream directly through plain challenge-response eavesdropping'
    ],
    securityConcerns: [
      'Fluhrer-Mantin-Shamir (FMS) attack exploiting weak RC4 keys for rapid key recovery',
      'KoreK and PTW (Pyshkin-Tews-Weinmann) attacks recovering 104-bit keys in seconds with minimal packets',
      'Arbitrary packet injection and ARP replay attacks',
      'Officially deprecated and declared insecure by IEEE in 2004'
    ],
    isActive: true,
  },
  {
    id: 'wpa',
    abbreviation: 'WPA',
    name: 'Wi-Fi Protected Access',
    standard: 'IEEE 802.11i Draft (Pre-Standard)',
    releaseYear: 2003,
    encryptionMethod: 'Temporal Key Integrity Protocol (TKIP) with RC4 cipher (128-bit encryption keys) and 48-bit IV/TSC',
    authenticationMethod: 'WPA-Personal (Pre-Shared Key / WPA-PSK via 4-Way Handshake) and WPA-Enterprise (IEEE 802.1X / EAP with RADIUS)',
    description: 'Wi-Fi Protected Access was an interim standard introduced by the Wi-Fi Alliance in 2003 to immediately resolve severe WEP vulnerabilities prior to final ratification of the comprehensive IEEE 802.11i security specification.',
    strengths: [
      'Eliminated IV collisions via dynamic 48-bit Temporal Key Integrity sequence counters',
      'Introduced per-packet key mixing combining master key, transmitter MAC, and sequence numbers',
      'Incorporated Michael Message Integrity Code (MIC) with anti-replay tracking',
      'Backwards compatible: enabled via firmware upgrades on existing legacy WEP network interface cards'
    ],
    weaknesses: [
      'Still fundamentally reliant on the aging RC4 stream cipher engine',
      'Michael MIC algorithm is mathematically weak, enforcing a disruptive 60-second shutdown upon two detected errors',
      'Susceptible to Beck-Tews (Chopchop variation) and Ohigashi-Kawano partial packet decryption attacks',
      'Deprecating performance penalties caused by multi-phase software key mixing'
    ],
    securityConcerns: [
      'Offline dictionary and rainbow-table attacks against captured 4-way handshakes with weak pre-shared passwords',
      'Susceptibility to Denial of Service (DoS) triggered by spoofed packets designed to trip Michael countermeasures',
      'Officially superseded by WPA2 and phased out across certified Wi-Fi equipment'
    ],
    isActive: true,
  },
  {
    id: 'wpa2',
    abbreviation: 'WPA2',
    name: 'Wi-Fi Protected Access 2',
    standard: 'IEEE 802.11i-2004 (Ratified)',
    releaseYear: 2004,
    encryptionMethod: 'Counter Mode Cipher Block Chaining Message Authentication Code Protocol (CCMP) using AES (128-bit keys)',
    authenticationMethod: 'WPA2-Personal (PSK with 4-Way Handshake) and WPA2-Enterprise (IEEE 802.1X/EAP with dynamic pairwise/group keys)',
    description: 'Wi-Fi Protected Access 2 represents the full implementation of the IEEE 802.11i-2004 standard. It mandated NIST-standardized Advanced Encryption Standard (AES) hardware cryptography, becoming the global benchmark for wireless security for over 15 years.',
    strengths: [
      'Cryptographically sound AES symmetric block cipher (128-bit) provides robust confidentiality',
      'CCMP provides simultaneous data encryption and authentic data integrity verification (CBC-MAC)',
      'Universal global hardware support across virtually all modern computers, smartphones, and routers',
      'Proven enterprise maturity with RADIUS integration, dynamic VLAN tagging, and 802.1X authentication'
    ],
    weaknesses: [
      'Lacks forward secrecy in PSK mode; compromise of master passphrase permits retroactive decryption of recorded sessions',
      'Unprotected management frames in baseline implementations allow deauthentication and disassociation spoofing',
      'Subject to offline dictionary and brute-force cracking against captured 4-way handshake frames',
      'Requires hardware-accelerated AES chips, preventing legacy non-AES hardware backward compatibility'
    ],
    securityConcerns: [
      'Key Reinstallation Attacks (KRACK, 2017) exploiting state machine flaws in the 4-way handshake to replay or decrypt frames',
      'Evil Twin and rogue AP attacks exploiting unauthenticated probe requests and beacon frames',
      'Deauthentication attacks used by adversaries to force clients to re-authenticate and leak handshakes'
    ],
    isActive: true,
  },
  {
    id: 'wpa3',
    abbreviation: 'WPA3',
    name: 'Wi-Fi Protected Access 3',
    standard: 'IEEE 802.11-2016 / Wi-Fi Alliance WPA3',
    releaseYear: 2018,
    encryptionMethod: 'WPA3-Personal: 128-bit AES-CCMP; WPA3-Enterprise: 192-bit CNSA-compliant suite (256-bit AES-GCM / 384-bit ECDSA / ECDH)',
    authenticationMethod: 'Simultaneous Authentication of Equals (SAE / Dragonfly Handshake) for Personal; IEEE 802.1X with CNSA suite for Enterprise; mandatory PMF',
    description: 'Wi-Fi Protected Access 3 is the modern wireless security protocol announced by the Wi-Fi Alliance in 2018. It fundamentally revamps personal authentication by replacing the pre-shared key 4-way handshake with the Simultaneous Authentication of Equals (SAE) protocol and mandating Protected Management Frames (PMF).',
    strengths: [
      'Provides true forward secrecy: passive attackers cannot decrypt historic traffic even if passphrase is later revealed',
      'Renders offline dictionary and brute-force attacks impossible through zero-knowledge proof SAE exchange',
      'Mandatory Protected Management Frames (PMF / 802.11w) eliminate trivial deauthentication and disconnect spoofing',
      'Commercial National Security Algorithm (CNSA) 192-bit mode aligns with high-assurance defense/financial standards'
    ],
    weaknesses: [
      'Transition mode (WPA2/WPA3 mixed networks) introduces downgrade vulnerabilities to legacy handshakes',
      'Higher computational overhead on low-cost IoT access points performing elliptic curve point derivations',
      'Incompatibility with older legacy client hardware that lacks SAE protocol or PMF firmware support',
      'Initial specification revisions exhibited cryptographic implementation timing side-channels'
    ],
    securityConcerns: [
      'Dragonblood suite of vulnerabilities (CVE-2019-9494, etc.) exposing timing leaks in SAE hunting-and-pecking loop',
      'Denial of service through memory/CPU exhaustion by bombarding access points with forged SAE commit messages',
      'Downgrade attacks executed when operating in hybrid WPA2/WPA3 transition modes'
    ],
    isActive: true,
  }
];

export const DEFAULT_CRITERIA: Criterion[] = [
  {
    id: 'ss',
    code: 'SS',
    name: 'Security Strength',
    description: 'Measures the comprehensive defense capability of the protocol against known theoretical and practical cryptographic attacks, cipher flaw resistance, and systemic architecture integrity.',
    weight: 14.2857,
    displayOrder: 1,
    scaleInterpretation: {
      1: 'Very Low: Cryptographically broken architecture; trivial exploitation in real time.',
      2: 'Low: Substantial structural defects; vulnerable to targeted exploitation without specialized resources.',
      3: 'Moderate: Satisfactory baseline defense under standard conditions; vulnerable to advanced persistent exploits.',
      4: 'High: Robust cryptographic design; resilient against almost all common network attack vectors.',
      5: 'Very High: Cutting-edge defense with formal forward secrecy and zero-knowledge mutual verification.'
    },
    isInvertedMetric: false,
  },
  {
    id: 'vl',
    code: 'VL',
    name: 'Vulnerability Level',
    description: 'Assesses the extent and severity of documented vulnerabilities, architectural flaws, and unpatched attack surfaces. Note: In this system, higher score indicates lower vulnerability risk (greater security).',
    weight: 14.2857,
    displayOrder: 2,
    scaleInterpretation: {
      1: 'Very High Vulnerability: Catastrophic systemic flaws, full key extraction demonstrated.',
      2: 'High Vulnerability: Severe architectural flaws (e.g. weak integrity algorithm, known exploit tools).',
      3: 'Moderate Vulnerability: Known specific state-machine vulnerabilities (e.g. KRACK) requiring active mitigation.',
      4: 'Low Vulnerability: Minimal unpatched attack vectors; restricted to complex side-channel or transition leaks.',
      5: 'Very Low Vulnerability: Highest resilience; negligible documented structural vulnerabilities.'
    },
    isInvertedMetric: true,
  },
  {
    id: 'er',
    code: 'ER',
    name: 'Encryption Robustness',
    description: 'Evaluates the cryptographic cipher suite strength, key size, initialization vector dynamics, and message integrity verification mechanisms.',
    weight: 14.2857,
    displayOrder: 3,
    scaleInterpretation: {
      1: 'Very Low: Inadequate stream cipher (RC4 with short static IVs); trivial key reconstruction.',
      2: 'Low: Wrapped stream cipher (RC4 with TKIP mixing); weak integrity check (Michael).',
      3: 'Moderate: Reliable block cipher (AES-128 CCMP) with satisfactory CBC-MAC integrity.',
      4: 'High: Strong AES implementation with dynamic re-keying and hardened tamper resistance.',
      5: 'Very High: NIST/CNSA-grade encryption (AES-GCM 256-bit, Galois/Counter Mode, elliptic curves).'
    },
    isInvertedMetric: false,
  },
  {
    id: 'ae',
    code: 'AE',
    name: 'Authentication Effectiveness',
    description: 'Assesses mutual authentication strength, key exchange handshake security, resistance to offline dictionary attacks, and credential verification integrity.',
    weight: 14.2857,
    displayOrder: 4,
    scaleInterpretation: {
      1: 'Very Low: Flawed challenge-response or open unauthenticated association; zero credential protection.',
      2: 'Low: Pre-shared key 4-way handshake prone to offline dictionary brute-force capture.',
      3: 'Moderate: Standard 4-way handshake with 802.1X enterprise option; vulnerable if weak passphrases used.',
      4: 'High: Hardened EAP methods with certificate authority verification and secure token support.',
      5: 'Very High: Simultaneous Authentication of Equals (SAE) with zero-knowledge proof and mandatory PMF.'
    },
    isInvertedMetric: false,
  },
  {
    id: 'car',
    code: 'CAR',
    name: 'Cyberattack Resistance',
    description: 'Evaluates empirical resilience against prevalent attack methodologies: deauthentication DoS, replay attacks, man-in-the-middle (MitM), dictionary cracking, and packet injection.',
    weight: 14.2857,
    displayOrder: 5,
    scaleInterpretation: {
      1: 'Very Low: Readily exploited by automated tools (Aircrack-ng, FMS, PTW) within minutes.',
      2: 'Low: Prone to DoS countermeasures shutdown, chopchop packet decryption, and handshake capture.',
      3: 'Moderate: Resilient against casual eavesdropping; vulnerable to deauth frame spoofing and KRACK state replay.',
      4: 'High: Strong resistance against packet injection and interception; requires high-capability adversary.',
      5: 'Very High: Impervious to offline dictionary cracking; protected management frames block deauth floods.'
    },
    isInvertedMetric: false,
  },
  {
    id: 'npe',
    code: 'NPE',
    name: 'Network Performance Efficiency',
    description: 'Measures transmission throughput overhead, cryptographic processing latency, packet header expansion, and computational footprint on access points and client hardware.',
    weight: 14.2857,
    displayOrder: 6,
    scaleInterpretation: {
      1: 'Very Low: Unacceptable latency or extreme packet processing bottlenecks.',
      2: 'Low: Heavy software processing overhead causing noticeable throughput degradation on legacy chips.',
      3: 'Moderate: Acceptable baseline overhead balanced between confidentiality and hardware demands.',
      4: 'High: Efficient hardware-accelerated crypto engine with minimal frame overhead and low latency.',
      5: 'Very High: Highly optimized hardware pipelining with negligible impact on multi-gigabit throughput.'
    },
    isInvertedMetric: false,
  },
  {
    id: 'oa',
    code: 'OA',
    name: 'Organisational Adoption',
    description: 'Reflects global enterprise and consumer adoption rates, ecosystem compatibility, regulatory standard endorsement, and legacy vendor hardware interoperability.',
    weight: 14.2857,
    displayOrder: 7,
    scaleInterpretation: {
      1: 'Very Low: Obsolete, prohibited by compliance frameworks (PCI-DSS, HIPAA), zero modern adoption.',
      2: 'Low: Phased out; strictly restricted to isolated legacy industrial deployments.',
      3: 'Moderate: Moderate adoption in legacy networks; being actively superseded in modern rollouts.',
      4: 'High: Very high global footprint; ubiquitous consumer, enterprise, and institutional presence.',
      5: 'Very High: Mandated modern standard; expanding across all new Wi-Fi 6/6E/7 enterprise deployments.'
    },
    isInvertedMetric: false,
  }
];

// Pre-calculated baseline demonstration assessments clearly flagged as DEMONSTRATION DATA
export const DEMO_ASSESSMENTS: Assessment[] = [
  {
    id: 'demo-wep',
    protocolId: 'wep',
    protocolAbbreviation: 'WEP',
    researcherName: 'Academic Demonstration Benchmark',
    assessmentDate: '2026-03-01',
    isDemonstration: true,
    scores: {
      ss: { score: 1, justification: 'Completely compromised cryptographic foundation; cracked in minutes with standard packet injection tools.' },
      vl: { score: 1, justification: 'Extremely high vulnerability: short 24-bit IV reuse and linear CRC-32 integrity enable trivial total key recovery.' },
      er: { score: 1, justification: 'Weak RC4 stream cipher implementation with no key scheduling protection or dynamic session keys.' },
      ae: { score: 1, justification: 'Open System or flawed Shared Key Authentication exposes the pseudo-random keystream directly.' },
      car: { score: 1, justification: 'Defenseless against FMS, KoreK, PTW, and automated replay attacks.' },
      npe: { score: 3, justification: 'Low computational footprint on 90s chips, but zero integrity protection negates throughput utility.' },
      oa: { score: 1, justification: 'Banned by regulatory frameworks worldwide (PCI-DSS, ISO 27001); zero acceptable contemporary deployment.' },
    },
    overallScore: 1.29,
    percentage: 25.80,
    classification: 'Poor',
    notes: 'Demonstration baseline confirming complete inadequacy of legacy 802.11b WEP protocol.',
  },
  {
    id: 'demo-wpa',
    protocolId: 'wpa',
    protocolAbbreviation: 'WPA',
    researcherName: 'Academic Demonstration Benchmark',
    assessmentDate: '2026-03-01',
    isDemonstration: true,
    scores: {
      ss: { score: 2, justification: 'Interim patch extending RC4 life; solved immediate IV reuse but remains fundamentally fragile.' },
      vl: { score: 2, justification: 'High vulnerability due to Michael MIC weaknesses, Beck-Tews attacks, and offline dictionary cracking.' },
      er: { score: 2, justification: 'TKIP with 48-bit IV is an improvement over WEP, but remains restricted by underlying RC4 stream cipher.' },
      ae: { score: 2, justification: '4-Way Handshake with PSK vulnerable to offline dictionary attack if weak passphrase is used.' },
      car: { score: 2, justification: 'Vulnerable to Michael DoS shutdown attack and partial decryption exploits (Ohigashi-Kawano).' },
      npe: { score: 3, justification: 'Acceptable compatibility on legacy firmware, though multi-step key mixing causes CPU overhead.' },
      oa: { score: 2, justification: 'Superseded by WPA2 in 2004; deprecated across modern Wi-Fi Alliance certified equipment.' },
    },
    overallScore: 2.14,
    percentage: 42.80,
    classification: 'Poor',
    notes: 'Demonstration baseline illustrating WPA as a historical stopgap protocol.',
  },
  {
    id: 'demo-wpa2',
    protocolId: 'wpa2',
    protocolAbbreviation: 'WPA2',
    researcherName: 'Academic Demonstration Benchmark',
    assessmentDate: '2026-03-01',
    isDemonstration: true,
    scores: {
      ss: { score: 4, justification: 'Strong cryptographic core anchored in AES block cipher; robust industry defense standard for 15+ years.' },
      vl: { score: 3, justification: 'Moderate vulnerability: susceptible to KRACK state replay and unauthenticated management frame spoofing.' },
      er: { score: 4, justification: 'AES-CCMP 128-bit provides robust data confidentiality and message integrity via CBC-MAC.' },
      ae: { score: 3, justification: 'Effective 4-way handshake, though vulnerable to offline dictionary attacks without forward secrecy.' },
      car: { score: 3, justification: 'Vulnerable to deauthentication DoS attacks and handshake capture without Protected Management Frames.' },
      npe: { score: 4, justification: 'Broadly implemented in dedicated AES hardware ASICs providing wire-speed throughput.' },
      oa: { score: 5, justification: 'Near-universal global deployment across billions of commercial, consumer, and enterprise devices.' },
    },
    overallScore: 3.71,
    percentage: 74.20,
    classification: 'Very Good',
    notes: 'Demonstration baseline reflecting proven, robust, yet legacy-encumbered WPA2 standard.',
  },
  {
    id: 'demo-wpa3',
    protocolId: 'wpa3',
    protocolAbbreviation: 'WPA3',
    researcherName: 'Academic Demonstration Benchmark',
    assessmentDate: '2026-03-01',
    isDemonstration: true,
    scores: {
      ss: { score: 5, justification: 'State-of-the-art security suite with SAE, zero-knowledge verification, and forward secrecy.' },
      vl: { score: 4, justification: 'Very low vulnerability in native mode; minor side-channel leaks (Dragonblood) addressed in revisions.' },
      er: { score: 5, justification: 'Exceptional: supports AES-GCM and optional 192-bit CNSA security suite for high-assurance settings.' },
      ae: { score: 5, justification: 'Simultaneous Authentication of Equals (SAE) provides mathematically provable resistance to offline dictionary attacks.' },
      car: { score: 4, justification: 'Mandatory Protected Management Frames (PMF) block deauthentication and disassociation spoofing.' },
      npe: { score: 4, justification: 'Modern hardware acceleration yields top throughput, though complex SAE handshakes demand AP CPU cycles.' },
      oa: { score: 4, justification: 'Mandated on all new certified Wi-Fi equipment and Wi-Fi 6/7; rapidly growing enterprise footprint.' },
    },
    overallScore: 4.43,
    percentage: 88.60,
    classification: 'Excellent',
    notes: 'Demonstration baseline representing the contemporary gold standard for wireless network security.',
  }
];
