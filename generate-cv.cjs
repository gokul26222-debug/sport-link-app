const docx = require("docx");
const fs = require("fs");

const {
  Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun,
  WidthType, AlignmentType, BorderStyle, ExternalHyperlink,
  TableLayoutType, VerticalAlign, ShadingType,
} = docx;

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

const F = "Arial";
const A4_W = 11906;
const A4_H = 16838;
const M = 360;
const CW = A4_W - 2 * M;
const SW = Math.round(CW * 0.31);
const MW = CW - SW;

const noB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBs = { top: noB, bottom: noB, left: noB, right: noB };

// ─── Helpers ───
function p(runs, before = 0, after = 0, opts = {}) {
  return new Paragraph({
    spacing: { before, after, line: opts.line || 240 },
    alignment: opts.align || AlignmentType.LEFT,
    indent: opts.indent || undefined,
    border: opts.border || undefined,
    children: Array.isArray(runs) ? runs : [runs],
  });
}

function t(text, size, color, bold = false, italic = false) {
  return new TextRun({ text, font: F, size, color, bold, italics: italic });
}

function link(label, url, size, color) {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text: label, font: F, size, color, underline: { type: "single" } })],
  });
}

function sHead(text) {
  return p(t(text, 18, C.accentDark, true), 140, 50, {
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "3A5A80" } },
  });
}

function mHead(text) {
  return p(t(text, 19, C.accentLight, true), 120, 40, {
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.accentLight } },
  });
}

function bul(text) {
  return p([t("• ", 16, C.bodyText), t(text, 16, C.bodyText)], 10, 10, {
    indent: { left: 160, hanging: 160 }, line: 230,
  });
}

function badge(text) {
  return new TextRun({
    text: ` ${text} `, font: F, size: 13, color: "FFFFFF", bold: true,
    shading: { type: ShadingType.CLEAR, fill: C.accentLight, color: C.accentLight },
  });
}

// ═══════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════
const S = [];

// Photo placeholder — smaller
S.push(p([], 20, 0));
S.push(new Table({
  rows: [new TableRow({
    height: { value: 1400, rule: "exact" },
    children: [new TableCell({
      width: { size: SW - 500, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      shading: { type: ShadingType.CLEAR, fill: C.photoBg },
      borders: {
        top: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
        bottom: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
        left: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
        right: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
      },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [t("ADD", 18, C.sidebarMuted, true)] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [t("PHOTO", 18, C.sidebarMuted, true)] }),
      ],
    })],
  })],
  width: { size: SW - 500, type: WidthType.DXA },
  layout: TableLayoutType.FIXED,
}));

// Name — tight
S.push(p(t("GOKUL", 28, "FFFFFF", true), 120, 0));
S.push(p(t("SRINIVASAN", 28, "FFFFFF", true), 0, 10));

// Tagline
S.push(p(t("PRODUCT MANAGER · GROWTH · OPS", 15, C.accentDark, true), 0, 20));

// Work auth — single line
S.push(p([t("✓ ", 14, C.green, true), t("Authorized to work in France", 13, C.green)], 0, 0));
S.push(p(t("   No sponsorship needed", 13, C.green), 0, 20));

// CONTACT
S.push(sHead("CONTACT"));
S.push(p(t("Paris, France", 16, C.sidebarText), 10, 5));
S.push(p(t("+33 7 45 43 23 95", 16, C.sidebarText), 5, 5));
S.push(p(t("gokul26222@gmail.com", 15, C.sidebarText), 5, 5));
S.push(p(link("linkedin.com/in/gokulsrini", "https://www.linkedin.com/in/gokulsrini", 15, C.accentDark), 5, 5));
S.push(p(link("Portfolio ↗", "https://portfolio-orcin-nu-xm2481apwv.vercel.app", 15, C.accentDark), 5, 5));

// LANGUAGES
S.push(sHead("LANGUAGES"));
S.push(p([t("English", 16, C.sidebarText, true), t(" — Fluent (C2)", 14, C.sidebarMuted)], 10, 5));
S.push(p([t("Tamil", 16, C.sidebarText, true), t(" — Native", 14, C.sidebarMuted)], 5, 5));
S.push(p([t("French", 16, C.sidebarText, true), t(" — A2, in training", 14, C.sidebarMuted)], 5, 5));

// EDUCATION
S.push(sHead("EDUCATION"));
S.push(p(t("MSc International Business", 16, C.sidebarText, true), 10, 0));
S.push(p(t("EMLV Grande École, Paris", 14, C.sidebarMuted), 0, 0));
S.push(p(t("2023 – 2025", 14, C.sidebarMuted), 0, 5));

// CERTIFICATIONS
S.push(sHead("CERTIFICATIONS"));
S.push(p(t("Product Prioritization", 15, C.sidebarText, true), 10, 0));
S.push(p(t("Product School", 13, C.sidebarMuted), 0, 10));
S.push(p(t("Agile Project Mgmt", 15, C.sidebarText, true), 10, 0));
S.push(p(t("PMI France", 13, C.sidebarMuted), 0, 10));
S.push(p(t("HubSpot Inbound & Sales", 15, C.sidebarText, true), 10, 0));

// CORE TOOLS
S.push(sHead("CORE TOOLS"));
S.push(p(t("Notion · Jira · Figma", 15, C.sidebarText), 10, 5));
S.push(p(t("Mixpanel · Amplitude", 15, C.sidebarText), 5, 5));
S.push(p(t("Google Analytics · Hotjar", 15, C.sidebarText), 5, 5));

// ═══════════════════════════════════
// MAIN COLUMN
// ═══════════════════════════════════
const R = [];

// PROFILE
R.push(mHead("PROFILE"));
R.push(p(
  t("Product-minded business graduate with 3+ years across customer success, support engineering and sales. Building case studies and shipping real prototypes (Cleo, PlayPal) to prove product thinking through execution. MSc International Business, EMLV Paris. Based in Paris, fully authorized to work in France.", 16, C.bodyText),
  20, 40, { line: 230 }
));

// PROJECTS
R.push(mHead("PROJECTS"));

R.push(p([t("Cleo", 18, C.bodyText, true), t(" — AI assistant for intl. students in France  ", 16, C.bodyText), badge("LIVE")], 30, 0));
R.push(p(t("Next.js · Gemini · Groq/Llama", 14, C.grayText, false, true), 0, 0));
R.push(p(link("cleo-app-theta.vercel.app", "https://cleo-app-theta.vercel.app", 14, C.accentLight), 0, 10));
R.push(bul("Identified 400K+ intl. students/yr with no onboarding guide for CAF, CPAM, OFII & banking — shipped a free AI guide with a 7-day action plan."));
R.push(bul("Owned full lifecycle solo: discovery, PRD, LLM prompt design, API integration, UX, deployment, iteration."));

R.push(p([t("PlayPal", 18, C.bodyText, true), t(" — social sports app for local matches  ", 16, C.bodyText), badge("LIVE MVP")], 40, 0));
R.push(p(t("React · Supabase · Lovable", 14, C.grayText, false, true), 0, 0));
R.push(p(link("sport-link-app.lovable.app", "https://sport-link-app.lovable.app", 14, C.accentLight), 0, 10));
R.push(bul("Validated demand via user interviews, shipped end-to-end: PRD, user stories, MoSCoW roadmap, UX, launch. NSM: weekly active players per city."));

// EXPERIENCE
R.push(mHead("EXPERIENCE"));

R.push(p(t("Customer Success Manager", 18, C.bodyText, true), 30, 0));
R.push(p(t("Octopus Era, Paris · 2023 – 2024", 14, C.grayText, false, true), 0, 10));
R.push(bul("Managed €16K+ client portfolio across digital marketing engagements, delivering 90%+ on time and on scope."));
R.push(bul("Drove 20%+ account growth via proactive check-ins, upsell identification and QBRs aligned to client OKRs."));

R.push(p(t("Product Support Engineer", 18, C.bodyText, true), 40, 0));
R.push(p(t("Vxceed Software, Bengaluru · 2021 – 2022", 14, C.grayText, false, true), 0, 10));
R.push(bul("Protected INR 2Cr+ (~€220K) revenue by resolving 50+ critical escalations; built 50-entry KB cutting repeat escalations ~33%."));
R.push(bul("Surfaced 12+ bug patterns from support data → 3 shipped fixes eliminating entire ticket classes."));

R.push(p(t("Sales & Marketing Intern", 18, C.bodyText, true), 40, 0));
R.push(p(t("iCell, Paris · 2025 – 2026 (part-time)", 14, C.grayText, false, true), 0, 10));
R.push(bul("Designed 15+ content campaigns across 3 seasonal pushes; tracked 8 competitors weekly in market intel report informing pricing."));

// CASE STUDIES
R.push(mHead("PRODUCT CASE STUDIES"));
R.push(p([t("PhotoRoom ", 16, C.bodyText, true), t("(pricing): diagnosed flat-rate subs vs. rising AI compute costs; designed 3-layer monetisation fix.", 15, C.bodyText)], 20, 10, { line: 230 }));
R.push(p([t("Joko ", 16, C.bodyText, true), t("(retention): redesigned milestone loop to break 30-day churn, drive daily engagement (4M+ users).", 15, C.bodyText)], 10, 10, { line: 230 }));
R.push(p([t("Netflix ", 16, C.bodyText, true), t("(Gen Z growth): designed short-form clips feed converting scroll attention to full-title viewing (270M+ subs).", 15, C.bodyText)], 10, 10, { line: 230 }));
R.push(p([t("All case studies: ", 14, C.grayText), link("portfolio-orcin-nu-xm2481apwv.vercel.app", "https://portfolio-orcin-nu-xm2481apwv.vercel.app", 14, C.accentLight)], 10, 10));

// ═══════════════════════════════════
// ASSEMBLE
// ═══════════════════════════════════
const mainTable = new Table({
  rows: [new TableRow({
    children: [
      new TableCell({
        width: { size: SW, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: C.sidebarBg },
        borders: noBs,
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 80, bottom: 80, left: 200, right: 160 },
        children: S,
      }),
      new TableCell({
        width: { size: MW, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
        borders: noBs,
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 80, bottom: 80, left: 220, right: 140 },
        children: R,
      }),
    ],
  })],
  width: { size: CW, type: WidthType.DXA },
  layout: TableLayoutType.FIXED,
  borders: { top: noB, bottom: noB, left: noB, right: noB, insideHorizontal: noB, insideVertical: noB },
});

// Skills — full width
const skills = [];
skills.push(p(t("KEY SKILLS & KEYWORDS", 18, C.accentLight, true), 100, 40, {
  border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.accentLight } },
}));

const sd = [
  ["Product", "PRD writing · product discovery · user research & JTBD · story mapping · roadmapping · OKRs · RICE · MVP scoping · SDLC · backlog mgmt"],
  ["Growth & Data", "activation & retention funnels · cohort analysis · A/B testing · North Star Metrics · product analytics · GTM strategy · AARRR"],
  ["AI / LLM", "LLM product design · AI agent workflows · prompt engineering · RAG · AI-assisted prototyping (Lovable, Cursor, Claude, GPT-4o, Gemini)"],
  ["Tools", "SQL · REST API · Supabase · Vercel · Sheets · Jira · Confluence · Notion · Figma · Miro · Mixpanel · Amplitude · GA · Hotjar · HubSpot · Agile/Scrum"],
];

for (const [label, detail] of sd) {
  skills.push(p([t(`${label}: `, 15, C.bodyText, true), t(detail, 14, C.grayText)], 8, 8, { line: 220 }));
}

const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { width: A4_W, height: A4_H, orientation: "portrait" },
        margin: { top: M, bottom: M, left: M, right: M },
      },
    },
    children: [mainTable, ...skills],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("Gokul_Srinivasan_CV_Visual.docx", buf);
  console.log("DOCX generated");
});
