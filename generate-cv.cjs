const docx = require("docx");
const fs = require("fs");

const {
  Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun,
  WidthType, AlignmentType, BorderStyle, HeadingLevel, ExternalHyperlink,
  TableLayoutType, VerticalAlign, ShadingType, PageBreakBefore,
  convertInchesToTwip, TabStopPosition, TabStopType, Header, Footer,
} = docx;

// Colors
const C = {
  sidebarBg: "1B2A41",
  photoBg: "2B3F59",
  accentDark: "5FA8FF",
  accentLight: "1B4FD8",
  bodyText: "26303D",
  grayText: "55606E",
  sidebarText: "E7EDF5",
  sidebarMuted: "AEC2DA",
  green: "7FE0A8",
};

const FONT = "Arial";
const A4_W = 11906; // A4 width in twips
const A4_H = 16838;
const MARGIN = 360; // ~0.25in
const CONTENT_W = A4_W - 2 * MARGIN;
const SIDE_W = Math.round(CONTENT_W * 0.32);
const MAIN_W = CONTENT_W - SIDE_W;

// Helper functions
function sidebarHeader(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 17,
        font: FONT,
        color: C.accentDark,
        allCaps: true,
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: C.accentDark },
    },
  });
}

function mainHeader(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 19,
        font: FONT,
        color: C.accentLight,
        allCaps: true,
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: C.accentLight },
    },
  });
}

function sideText(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: opts.size || 15,
    color: opts.color || C.sidebarText,
    bold: opts.bold || false,
    italics: opts.italics || false,
  });
}

function mainText(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: opts.size || 15,
    color: opts.color || C.bodyText,
    bold: opts.bold || false,
    italics: opts.italics || false,
  });
}

function sidePara(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 20, after: opts.after || 20 },
    alignment: opts.alignment || AlignmentType.LEFT,
    children: Array.isArray(runs) ? runs : [runs],
  });
}

function mainPara(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 20, after: opts.after || 20 },
    alignment: opts.alignment || AlignmentType.LEFT,
    children: Array.isArray(runs) ? runs : [runs],
  });
}

function sideLink(label, url) {
  return new ExternalHyperlink({
    children: [
      new TextRun({
        text: label,
        font: FONT,
        size: 15,
        color: C.accentDark,
        underline: { type: "single", color: C.accentDark },
      }),
    ],
    link: url,
  });
}

function mainLink(label, url) {
  return new ExternalHyperlink({
    children: [
      new TextRun({
        text: label,
        font: FONT,
        size: 14,
        color: C.accentLight,
        underline: { type: "single", color: C.accentLight },
      }),
    ],
    link: url,
  });
}

function bullet(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 10, after: 10 },
    indent: { left: 180, hanging: 180 },
    children: [
      mainText("•  ", { size: 14 }),
      mainText(text, { size: opts.size || 14 }),
    ],
  });
}

function badge(text) {
  return new TextRun({
    text: ` [${text}]`,
    font: FONT,
    size: 13,
    color: "FFFFFF",
    bold: true,
    shading: { type: ShadingType.CLEAR, fill: C.accentLight, color: C.accentLight },
  });
}

// ── SIDEBAR CONTENT ──
const sidebarContent = [];

// Photo placeholder
sidebarContent.push(new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }));
const photoTable = new Table({
  rows: [
    new TableRow({
      height: { value: 1800, rule: "exact" },
      children: [
        new TableCell({
          width: { size: SIDE_W - 400, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          shading: { type: ShadingType.CLEAR, fill: C.photoBg },
          borders: {
            top: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
            bottom: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
            left: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
            right: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "ADD", bold: true, font: FONT, size: 18, color: C.sidebarMuted }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "PHOTO", bold: true, font: FONT, size: 18, color: C.sidebarMuted }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  width: { size: SIDE_W - 400, type: WidthType.DXA },
  layout: TableLayoutType.FIXED,
});
sidebarContent.push(photoTable);

// Name
sidebarContent.push(new Paragraph({
  spacing: { before: 160, after: 0 },
  children: [sideText("GOKUL", { size: 26, bold: true, color: "FFFFFF" })],
}));
sidebarContent.push(new Paragraph({
  spacing: { before: 0, after: 40 },
  children: [sideText("SRINIVASAN", { size: 26, bold: true, color: "FFFFFF" })],
}));

// Tagline
sidebarContent.push(sidePara(
  sideText("PRODUCT MANAGER · GROWTH · OPS", { size: 14, color: C.accentDark, bold: true }),
  { before: 0, after: 40 }
));

// Work auth
sidebarContent.push(sidePara([
  sideText("✓ ", { size: 13, color: C.green, bold: true }),
  sideText("Authorized to work in France", { size: 12, color: C.green }),
], { before: 0, after: 20 }));
sidebarContent.push(sidePara(
  sideText("    No sponsorship needed", { size: 12, color: C.green }),
  { before: 0, after: 60 }
));

// CONTACT
sidebarContent.push(sidebarHeader("CONTACT"));
sidebarContent.push(sidePara(sideText("Paris, France", { size: 14 })));
sidebarContent.push(sidePara(sideText("+33 7 45 43 23 95", { size: 14 })));
sidebarContent.push(sidePara(sideText("gokul26222@gmail.com", { size: 14 })));
sidebarContent.push(new Paragraph({
  spacing: { before: 20, after: 20 },
  children: [sideLink("linkedin.com/in/gokulsrini", "https://www.linkedin.com/in/gokulsrini")],
}));
sidebarContent.push(new Paragraph({
  spacing: { before: 20, after: 20 },
  children: [sideLink("Portfolio", "https://portfolio-orcin-nu-xm2481apwv.vercel.app")],
}));

// LANGUAGES
sidebarContent.push(sidebarHeader("LANGUAGES"));
sidebarContent.push(sidePara([sideText("English", { size: 14, bold: true }), sideText(" — Fluent (C2)", { size: 13, color: C.sidebarMuted })]));
sidebarContent.push(sidePara([sideText("Tamil", { size: 14, bold: true }), sideText(" — Native", { size: 13, color: C.sidebarMuted })]));
sidebarContent.push(sidePara([sideText("French", { size: 14, bold: true }), sideText(" — A2, in training", { size: 13, color: C.sidebarMuted })]));

// EDUCATION
sidebarContent.push(sidebarHeader("EDUCATION"));
sidebarContent.push(sidePara(sideText("MSc International Business", { size: 14, bold: true })));
sidebarContent.push(sidePara(sideText("EMLV Grande École, Paris", { size: 13, color: C.sidebarMuted }), { before: 0 }));
sidebarContent.push(sidePara(sideText("2023 – 2025", { size: 13, color: C.sidebarMuted }), { before: 0 }));

// CERTIFICATIONS
sidebarContent.push(sidebarHeader("CERTIFICATIONS"));
sidebarContent.push(sidePara(sideText("Product Prioritization", { size: 13, bold: true })));
sidebarContent.push(sidePara(sideText("Product School", { size: 12, color: C.sidebarMuted }), { before: 0 }));
sidebarContent.push(sidePara(sideText("Agile Project Mgmt", { size: 13, bold: true }), { before: 40 }));
sidebarContent.push(sidePara(sideText("PMI France", { size: 12, color: C.sidebarMuted }), { before: 0 }));
sidebarContent.push(sidePara(sideText("HubSpot Inbound & Sales", { size: 13, bold: true }), { before: 40 }));

// CORE TOOLS
sidebarContent.push(sidebarHeader("CORE TOOLS"));
sidebarContent.push(sidePara(sideText("Notion · Jira · Figma", { size: 13 })));
sidebarContent.push(sidePara(sideText("Mixpanel · Amplitude", { size: 13 })));
sidebarContent.push(sidePara(sideText("Google Analytics · Hotjar", { size: 13 })));

// ── MAIN COLUMN CONTENT ──
const mainContent = [];

// PROFILE
mainContent.push(mainHeader("PROFILE"));
mainContent.push(mainPara(
  mainText("Product-minded business graduate with 3+ years across customer success, support engineering and sales. Now building case studies and shipping real prototypes (Cleo, PlayPal) to prove product thinking through execution, not theory. MSc International Business, EMLV Paris. Based in Paris, fully authorized to work in France.", { size: 14 }),
  { before: 30, after: 60 }
));

// PROJECTS
mainContent.push(mainHeader("PROJECTS"));

// Cleo
mainContent.push(mainPara([
  mainText("Cleo", { size: 15, bold: true }),
  mainText(" — AI assistant for international students in France ", { size: 14 }),
  badge("LIVE"),
], { before: 50, after: 0 }));
mainContent.push(mainPara([
  mainText("Next.js · Gemini · Groq/Llama", { size: 13, color: C.grayText, italics: true }),
], { before: 0, after: 0 }));
mainContent.push(new Paragraph({
  spacing: { before: 0, after: 20 },
  children: [mainLink("cleo-app-theta.vercel.app", "https://cleo-app-theta.vercel.app")],
}));
mainContent.push(bullet("Identified an underserved segment (400K+ international students/yr with no onboarding guide for CAF, CPAM, OFII, banking) and shipped a free AI guide with a 7-day action plan."));
mainContent.push(bullet("Owned the full lifecycle solo: discovery, PRD, LLM prompt design, API integration, UX, deployment, post-launch iteration."));

// PlayPal
mainContent.push(mainPara([
  mainText("PlayPal", { size: 15, bold: true }),
  mainText(" — social sports app for local match discovery ", { size: 14 }),
  badge("LIVE MVP"),
], { before: 60, after: 0 }));
mainContent.push(mainPara([
  mainText("React · Supabase · Lovable", { size: 13, color: C.grayText, italics: true }),
], { before: 0, after: 0 }));
mainContent.push(new Paragraph({
  spacing: { before: 0, after: 20 },
  children: [mainLink("sport-link-app.lovable.app", "https://sport-link-app.lovable.app")],
}));
mainContent.push(bullet("Validated demand through user interviews, then shipped end-to-end: PRD, user stories, MoSCoW roadmap, UX, launch and iteration. NSM: weekly active players per city."));

// PROFESSIONAL EXPERIENCE
mainContent.push(mainHeader("PROFESSIONAL EXPERIENCE"));

// CSM
mainContent.push(mainPara([
  mainText("Customer Success Manager", { size: 15, bold: true }),
], { before: 50, after: 0 }));
mainContent.push(mainPara([
  mainText("Octopus Era, Paris · 2023 – 2024", { size: 13, color: C.grayText, italics: true }),
], { before: 0, after: 10 }));
mainContent.push(bullet("Managed a €16K+ client portfolio across digital marketing engagements, delivering 90%+ on time and on scope."));
mainContent.push(bullet("Drove 20%+ account growth through proactive check-ins, upsell identification and quarterly business reviews aligned to client OKRs."));

// Product Support Engineer
mainContent.push(mainPara([
  mainText("Product Support Engineer", { size: 15, bold: true }),
], { before: 60, after: 0 }));
mainContent.push(mainPara([
  mainText("Vxceed Software Solutions, Bengaluru · 2021 – 2022", { size: 13, color: C.grayText, italics: true }),
], { before: 0, after: 10 }));
mainContent.push(bullet("Protected INR 2Cr+ (~€220K) in enterprise revenue by resolving 50+ critical escalations; built a 50-entry knowledge base that cut repeat escalations by ~33%."));
mainContent.push(bullet("Surfaced 12+ recurring bug patterns from support data and translated them into 3 shipped product fixes, eliminating entire ticket classes."));

// Sales intern
mainContent.push(mainPara([
  mainText("Sales & Marketing Intern", { size: 15, bold: true }),
], { before: 60, after: 0 }));
mainContent.push(mainPara([
  mainText("iCell, Paris · 2025 – 2026 (part-time)", { size: 13, color: C.grayText, italics: true }),
], { before: 0, after: 10 }));
mainContent.push(bullet("Designed and tested 15+ content campaigns across 3 seasonal pushes; tracked 8 competitors weekly in a market intelligence report informing pricing and promotions."));

// PRODUCT CASE STUDIES
mainContent.push(mainHeader("PRODUCT CASE STUDIES"));
mainContent.push(mainPara([
  mainText("PhotoRoom", { size: 14, bold: true }),
  mainText(" (pricing): diagnosed a mismatch between flat-rate subs and rising AI compute costs; designed a 3-layer monetisation fix to protect margin.", { size: 13 }),
], { before: 30, after: 10 }));
mainContent.push(mainPara([
  mainText("Joko", { size: 14, bold: true }),
  mainText(" (retention): redesigned the milestone progress loop to break a 30-day churn pattern and drive daily engagement (4M+ users).", { size: 13 }),
], { before: 10, after: 10 }));
mainContent.push(mainPara([
  mainText("Netflix", { size: 14, bold: true }),
  mainText(" (Gen Z growth): designed a short-form clips feed to convert scroll attention into full-title viewing (270M+ subs).", { size: 13 }),
], { before: 10, after: 10 }));
mainContent.push(new Paragraph({
  spacing: { before: 10, after: 20 },
  children: [
    mainText("Full case studies: ", { size: 13, color: C.grayText }),
    mainLink("portfolio-orcin-nu-xm2481apwv.vercel.app", "https://portfolio-orcin-nu-xm2481apwv.vercel.app"),
  ],
}));

// ── BUILD DOCUMENT ──
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const mainTable = new Table({
  rows: [
    new TableRow({
      children: [
        // Sidebar cell
        new TableCell({
          width: { size: SIDE_W, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: C.sidebarBg },
          borders: noBorders,
          verticalAlign: VerticalAlign.TOP,
          margins: { top: 100, bottom: 100, left: 200, right: 160 },
          children: sidebarContent,
        }),
        // Main cell
        new TableCell({
          width: { size: MAIN_W, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
          borders: noBorders,
          verticalAlign: VerticalAlign.TOP,
          margins: { top: 100, bottom: 100, left: 200, right: 160 },
          children: mainContent,
        }),
      ],
    }),
  ],
  width: { size: CONTENT_W, type: WidthType.DXA },
  layout: TableLayoutType.FIXED,
  borders: {
    top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
    insideHorizontal: noBorder, insideVertical: noBorder,
  },
});

// Full-width skills section
const skillsSection = [];
skillsSection.push(new Paragraph({
  spacing: { before: 140, after: 60 },
  children: [
    new TextRun({
      text: "KEY SKILLS & KEYWORDS",
      bold: true,
      size: 17,
      font: FONT,
      color: C.accentLight,
      allCaps: true,
    }),
  ],
  border: {
    bottom: { style: BorderStyle.SINGLE, size: 1, color: C.accentLight },
  },
}));

const skillLines = [
  { label: "Product", detail: "PRD writing, product discovery, user research & JTBD, user story mapping, roadmapping, OKRs, RICE, MVP scoping, SDLC, backlog management" },
  { label: "Growth & Data", detail: "activation & retention funnels, cohort analysis, A/B testing, North Star Metrics, product analytics, GTM strategy, AARRR" },
  { label: "AI / LLM", detail: "LLM product design, AI agent workflows, prompt engineering, RAG, AI-assisted prototyping (Lovable, Cursor, Claude, GPT-4o, Gemini)" },
  { label: "Technical & Tools", detail: "SQL, REST API & webhooks, Supabase, Vercel, Excel/Google Sheets, Jira, Confluence, Notion, Figma, Miro, Mixpanel, Amplitude, GA, Hotjar, HubSpot, Agile/Scrum" },
];

for (const s of skillLines) {
  skillsSection.push(new Paragraph({
    spacing: { before: 15, after: 15 },
    children: [
      mainText(`${s.label}: `, { size: 13, bold: true }),
      mainText(s.detail, { size: 12, color: C.grayText }),
    ],
  }));
}

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: A4_W, height: A4_H, orientation: "portrait" },
          margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        },
      },
      children: [mainTable, ...skillsSection],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Gokul_Srinivasan_CV_Visual.docx", buffer);
  console.log("DOCX generated successfully");
});
