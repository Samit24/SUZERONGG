// All site content lives here. Edit this file to update the portfolio.

export const config = {
  developer: {
    firstName: "Samit",
    lastName: "Pudasaini",
    fullName: "Samit Pudasaini",
    handle: "SUZERON",
    roles: ["Security Engineer", "Threat Hunter"],
  },
  contact: {
    email: "pudasainisamit@gmail.com",
    location: "Kathmandu, Nepal",
    github: "https://github.com/Samit24",
    linkedin: "https://linkedin.com/in/samit-pudasaini",
    resume: "/certificates/resume.pdf",
  },
  // Social profiles: any entry with a url shows up in the side icons and the contact section.
  // Leave url empty ("") to hide one.
  socials: [
    { name: "GitHub", url: "https://github.com/Samit24" },
    { name: "LinkedIn", url: "https://linkedin.com/in/samit-pudasaini" },
    { name: "Instagram", url: "https://instagram.com/suzeron_24" },
    { name: "X", url: "" },
    { name: "Facebook", url: "" },
    { name: "TryHackMe", url: "" },
  ],
  about: {
    title: "About Me",
    paragraphs: [
      "I'm a Security Engineer based in Kathmandu, Nepal. I turn noisy security telemetry into clear, trustworthy detections, and I care as much about cutting false positives as about catching real threats. I also share the detection tools I build as open source.",
    ],
    stats: [
      { value: "2+", label: "Years in security" },
      { value: "5+", label: "Organizations protected" },
      { value: "10+", label: "Certifications" },
    ],
  },
  skills: [
    {
      title: "DETECT & HUNT",
      description: "Finding threats before they become incidents",
      details:
        "Proactive hunts across endpoint and SIEM data, writing CQL queries that surface anomalies and indicators of compromise hidden in large log datasets.",
    },
    {
      title: "RESPOND & BUILD",
      description: "Incident response and security engineering",
      details:
        "Taking alerts from first triage to root cause, and building the log pipelines and automated SOAR workflows that make every investigation faster.",
    },
  ],
  career: [
    {
      position: "Security Engineer",
      company: "Raechal Enterprise Pvt. Ltd.",
      year: "NOW",
      period: "Sep 2025 – Present",
      description:
        "Lead incident response on complex alerts, run the team's proactive threat hunts and refine its automated detection workflows.",
    },
    {
      position: "Junior Security Engineer",
      company: "Raechal Enterprise Pvt. Ltd.",
      year: "2024",
      period: "Jul 2024 – Sep 2025",
      description:
        "Designed log ingestion pipelines for centralised SIEM monitoring and helped deploy and administer an enterprise CrowdStrike Falcon platform.",
    },
    {
      position: "B.I.M. Degree",
      company: "Nagarjuna College of IT, Tribhuvan University",
      year: "2025",
      period: "2020 – 2025",
      description: "Bachelor of Information Management, completed in 2025.",
    },
    {
      position: "NEB +2 Computer Science",
      company: "Kanjirowa National Higher Secondary School",
      year: "2020",
      period: "2020",
      description: "Higher secondary education in Computer Science.",
    },
  ],
  projects: [
    {
      title: "SIEM Log Analyzer",
      category: "Open source · Detection",
      technologies: "Python, detection rules, MITRE ATT&CK",
      description:
        "Parses Windows security and process events from JSON logs and runs detection rules for brute force, password spraying, encoded PowerShell and new admin accounts.",
      link: "https://github.com/Samit24/siem-log-analyzer",
      snippet: ["$ python -m siem_analyzer security.jsonl", "[HIGH] T1110 brute force: 42 failed logons", "[HIGH] T1059.001 encoded PowerShell", "[MED]  T1136 new admin account created"],
    },
    {
      title: "SOC Alert Triage Engine",
      category: "Open source · Triage",
      technologies: "Python, alert scoring, SLA queue",
      description:
        "Scores incoming alerts by severity, asset criticality and IoC matches, then builds a prioritised P1 to P4 queue with SLA deadlines.",
      link: "https://github.com/Samit24/soc-alert-triage",
      snippet: ["$ python -m triage alerts.json", "P1  score 94  dc01  sla 15m", "P2  score 71  web03 sla 1h", "P4  score 18  lab07 sla 24h"],
    },
    {
      title: "Network Traffic Analyzer",
      category: "Open source · Network",
      technologies: "Python, Zeek conn.log, network security",
      description:
        "Reads Zeek flow data to spot port scans, C2-style beaconing, large outbound transfers and connections on suspicious ports.",
      link: "https://github.com/Samit24/network-traffic-analyzer",
      snippet: ["$ python -m nta conn.log", "scan     10.0.4.12 -> 254 hosts", "beacon   10.0.2.8 every 60s ±2s", "exfil    1.8 GB to 185.x.x.x"],
    },
    {
      title: "CQL Threat Hunting Queries",
      category: "Open source · Hunting",
      technologies: "CQL, CrowdStrike Falcon, LogScale",
      description:
        "A library of CrowdStrike Query Language hunts for Falcon LogScale and Next-Gen SIEM, each mapped to a MITRE ATT&CK technique with triage notes.",
      link: "https://github.com/Samit24/cql-threat-hunting-queries",
      snippet: ["#event_simpleName=ProcessRollup2", "| ImageFileName=/powershell\\.exe/i", "| CommandLine=/-enc/i", "| groupBy([ComputerName])"],
    },
  ],
  certifications: [
    { name: "Threat Hunter", issuer: "CrowdStrike University", file: "/certificates/Threat Hunter.pdf", image: "/img/crowdstrike.jpg" },
    { name: "Incident Responder", issuer: "CrowdStrike University", file: "/certificates/Incident Responder.pdf", image: "/img/cd2.png" },
    { name: "Fusion SOAR Automation Workflows", issuer: "CrowdStrike University", file: "/certificates/Managing Automation Workflows with Fusion SOAR in Falcon Next-Gen SIEM.pdf", image: "/img/cd.png" },
    { name: "Falcon Endpoint Protection", issuer: "CrowdStrike University", file: "/certificates/CrowdStrike University Course Certificate.pdf", image: "/img/crowdstrike.jpg" },
    { name: "Introduction to Digital Forensics", issuer: "Security Blue Team", file: "/certificates/Introduction to Digital Forensics-course.pdf", image: "/img/forensics.jpg" },
    { name: "CompTIA Security+", issuer: "CompTIA", file: "", image: "/img/comptia.jpg", status: "In progress" },
  ],
  alsoCertified: [
    "Falcon Administrator · CrowdStrike",
    "Next-Gen SIEM Associate · CrowdStrike",
    "Core Security Professional · CrowdStrike",
    "Google Cybersecurity Professional · Coursera",
    "SOC Level 1 · TryHackMe",
    "Introduction to Cybersecurity · Cisco",
    "Certified Cybersecurity Educator Professional",
    "AI Security",
  ],
};
