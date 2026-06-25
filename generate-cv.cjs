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

const FONT = "Arial";
const A4_W = 11906;
const A4_H = 16838;
const MARGIN = 360;
const CONTENT_W = A4_W - 2 * MARGIN;
const SIDE_W = Math.round(CONTENT_W * 0.30);
const MAIN_W = CONTENT_W - SIDE_W;

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function sideHead(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 19, font: FONT, color: C.accentDark, allCaps: true })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "3A5A80" } },
  });
}

function mainHead(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 21, font: FONT, color: C.accentLight, allCaps: true })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.accentLight } },
  });
}

function st(text, opts = {}) {
  return new TextRun({
    text, font: FONT, size: opts.size || 17, color: opts.color || C.sidebarText,
    bold: opts.bold || false, italics: opts.italics || false,
  });
}

function mt(text, opts = {}) {
  return new TextRun({
    text, font: FONT, size: opts.size || 17, color: opts.color || C.bodyText,
    bold: opts.bold || false, italics: opts.italics || false,
  });
}

function sp(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 20, after: opts.after || 20 },
    alignment: opts.align || AlignmentType.LEFT,
    children: Array.isArray(runs) ? runs : [runs],
  });
}

function mp(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 20, after: opts.after || 20 },
    alignment: opts.align || AlignmentType.LEFT,
    children: Array.isArray(runs) ? runs : [runs],
    indent: opts.indent || undefined,
  });
}

function sideLink(label, url) {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text: label, font: FONT, size: 16, color: C.accentDark, underline: { type: "single" } })],
  });
}

function mainLink(label, url) {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text: label, font: FONT, size: 16, color: C.accentLight, underline: { type: "single" } })],
  });
}

function bullet(text, size = 16) {
  return new Paragraph({
    spacing: { before: 20, after: 20 },
    indent: { left: 200, hanging: 200 },
    children: [mt("•  ", { size }), mt(text, { size })],
  });
}

function badge(text) {
  return new TextRun({
    text: ` ${text} `, font: FONT, size: 14, color: "FFFFFF", bold: true,
    shading: { type: ShadingType.CLEAR, fill: C.accentLight, color: C.accentLight },
  });
}

// ═══ SIDEBAR ═══
const side = [];

side.push(new Paragraph({ spacing: { before: 40, after: 0 }, children: [] }));
side.push(new Table({
  rows: [new TableRow({
    height: { value: 1700, rule: "exact" },
    children: [new TableCell({
      width: { size: SIDE_W - 500, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      shading: { type: ShadingType.CLEAR, fill: C.photoBg },
      borders: {
        top: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
        bottom: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
        left: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
        right: { style: BorderStyle.DASHED, size: 1, color: C.sidebarMuted },
      },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ADD", bold: true, font: FONT, size: 20, color: C.sidebarMuted })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "PHOTO", bold: true, font: FONT, size: 20, color: C.sidebarMuted })] }),
      ],
    })],
  })],
  width: { size: SIDE_W - 500, type: WidthType.DXA },
  layout: TableLayoutType.FIXED,
}));

side.push(sp(st("GOKUL", { size: 30, bold: true, color: "FFFFFF" }), { before: 180, after: 0 }));
side.push(sp(st("SRINIVASAN", { size: 30, bold: true, color: "FFFFFF" }), { before: 0, after: 30 }));

side.push(sp(st("PRODUCT MANAGER", { size: 16, color: C.accentDark, bold: true }), { before: 0, after: 0 }));
side.push(sp(st("GROWTH · OPS", { size: 16, color: C.accentDark, bold: true }), { before: 0, after: 40 }));

side.push(sp([
  st("✓ ", { size: 15, color: C.green, bold: true }),
  st("Authorized to work in France", { size: 14, color: C.green }),
], { before: 0, after: 0 }));
side.push(sp(st("   No sponsorship needed", { size: 14, color: C.green }), { before: 0, after: 40 }));

side.push(sideHead("CONTACT"));
side.push(sp(st("Paris, France")));
side.push(sp(st("+33 7 45 43 23 95")));
side.push(sp(st("gokul26222@gmail.com", { size: 16 })));
side.push(new Paragraph({ spacing: { before: 20, after: 20 }, children: [sideLink("linkedin.com/in/gokulsrini", "https://www.linkedin.com/in/gokulsrini")] }));
side.push(new Paragraph({ spacing: { before: 20, after: 20 }, children: [sideLink("Portfolio ↗", "https://portfolio-orcin-nu-xm2481apwv.vercel.app")] }));

side.push(sideHead("LANGUAGES"));
side.push(sp([st("English", { bold: true }), st(" — Fluent (C2)", { size: 15, color: C.sidebarMuted })]));
side.push(sp([st("Tamil", { bold: true }), st(" — Native", { size: 15, color: C.sidebarMuted })]));
side.push(sp([st("French", { bold: true }), st(" — A2, in training", { size: 15, color: C.sidebarMuted })]));

side.push(sideHead("EDUCATION"));
side.push(sp(st("MSc International Business", { bold: true })));
side.push(sp(st("EMLV Grande École, Paris", { size: 15, color: C.sidebarMuted }), { before: 0 }));
side.push(sp(st("2023 – 2025", { size: 15, color: C.sidebarMuted }), { before: 0 }));

side.push(sideHead("CERTIFICATIONS"));
side.push(sp(st("Product Prioritization", { size: 16, bold: true })));
side.push(sp(st("Product School", { size: 14, color: C.sidebarMuted }), { before: 0 }));
side.push(sp(st("Agile Project Mgmt", { size: 16, bold: true }), { before: 50 }));
side.push(sp(st("PMI France", { size: 14, color: C.sidebarMuted }), { before: 0 }));
side.push(sp(st("HubSpot Inbound & Sales", { size: 16, bold: true }), { before: 50 }));

side.push(sideHead("CORE TOOLS"));
side.push(sp(st("Notion · Jira · Figma")));
side.push(sp(st("Mixpanel · Amplitude")));
side.push(sp(st("Google Analytics · Hotjar")));

// ═══ MAIN COLUMN ═══
const main = [];

main.push(mainHead("PROFILE"));
main.push(mp(
  mt("Product-minded business graduate with 3+ years across customer success, support engineering and sales. Building case studies and shipping real prototypes (Cleo, PlayPal) to prove product thinking through execution. MSc International Business, EMLV Paris. Based in Paris, fully authorized to work in France.", { size: 17 }),
  { before: 40, after: 80 }
));

main.push(mainHead("PROJECTS"));

main.push(mp([
  mt("Cleo", { size: 19, bold: true }),
  mt(" — AI assistant for intl. students in France  ", { size: 16 }),
  badge("LIVE"),
], { before: 60, after: 0 }));
main.push(mp(mt("Next.js · Gemini · Groq/Llama", { size: 15, color: C.grayText, italics: true }), { before: 0, after: 0 }));
main.push(new Paragraph({ spacing: { before: 0, after: 30 }, children: [mainLink("cleo-app-theta.vercel.app", "https://cleo-app-theta.vercel.app")] }));
main.push(bullet("Identified 400K+ intl. students/yr with no onboarding guide for CAF, CPAM, OFII & banking — shipped a free AI guide with a 7-day action plan."));
main.push(bullet("Owned full lifecycle solo: discovery, PRD, LLM prompt design, API integration, UX, deployment, post-launch iteration."));

main.push(mp([
  mt("PlayPal", { size: 19, bold: true }),
  mt(" — social sports app for local matches  ", { size: 16 }),
  badge("LIVE MVP"),
], { before: 80, after: 0 }));
main.push(mp(mt("React · Supabase · Lovable", { size: 15, color: C.grayText, italics: true }), { before: 0, after: 0 }));
main.push(new Paragraph({ spacing: { before: 0, after: 30 }, children: [mainLink("sport-link-app.lovable.app", "https://sport-link-app.lovable.app")] }));
main.push(bullet("Validated demand via user interviews, shipped end-to-end: PRD, user stories, MoSCoW roadmap, UX, launch. NSM: weekly active players per city."));

main.push(mainHead("EXPERIENCE"));

main.push(mp(mt("Customer Success Manager", { size: 19, bold: true }), { before: 60, after: 0 }));
main.push(mp(mt("Octopus Era, Paris · 2023 – 2024", { size: 15, color: C.grayText, italics: true }), { before: 0, after: 15 }));
main.push(bullet("Managed €16K+ client portfolio across digital marketing engagements, delivering 90%+ on time and on scope."));
main.push(bullet("Drove 20%+ account growth via proactive check-ins, upsell identification and QBRs aligned to client OKRs."));

main.push(mp(mt("Product Support Engineer", { size: 19, bold: true }), { before: 80, after: 0 }));
main.push(mp(mt("Vxceed Software, Bengaluru · 2021 – 2022", { size: 15, color: C.grayText, italics: true }), { before: 0, after: 15 }));
main.push(bullet("Protected INR 2Cr+ (~€220K) revenue by resolving 50+ critical escalations; built 50-entry KB cutting repeat escalations ~33%."));
main.push(bullet("Surfaced 12+ bug patterns from support data → 3 shipped fixes eliminating entire ticket classes."));

main.push(mp(mt("Sales & Marketing Intern", { size: 19, bold: true }), { before: 80, after: 0 }));
main.push(mp(mt("iCell, Paris · 2025 – 2026 (part-time)", { size: 15, color: C.grayText, italics: true }), { before: 0, after: 15 }));
main.push(bullet("Designed 15+ content campaigns across 3 seasonal pushes; tracked 8 competitors weekly in market intel report informing pricing."));

main.push(mainHead("PRODUCT CASE STUDIES"));
main.push(mp([
  mt("PhotoRoom ", { size: 17, bold: true }),
  mt("(pricing): diagnosed flat-rate subs vs. rising AI compute costs; designed 3-layer monetisation fix.", { size: 16 }),
], { before: 40, after: 15 }));
main.push(mp([
  mt("Joko ", { size: 17, bold: true }),
  mt("(retention): redesigned milestone loop to break 30-day churn, drive daily engagement (4M+ users).", { size: 16 }),
], { before: 15, after: 15 }));
main.push(mp([
  mt("Netflix ", { size: 17, bold: true }),
  mt("(Gen Z growth): designed short-form clips feed converting scroll attention to full-title viewing (270M+ subs).", { size: 16 }),
], { before: 15, after: 15 }));
main.push(new Paragraph({
  spacing: { before: 15, after: 30 },
  children: [mt("All case studies: ", { size: 15, color: C.grayText }), mainLink("portfolio-orcin-nu-xm2481apwv.vercel.app", "https://portfolio-orcin-nu-xm2481apwv.vercel.app")],
}));

// ═══ ASSEMBLE ═══
const mainTable = new Table({
  rows: [new TableRow({
    children: [
      new TableCell({
        width: { size: SIDE_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: C.sidebarBg },
        borders: noBorders,
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 120, bottom: 120, left: 220, right: 180 },
        children: side,
      }),
      new TableCell({
        width: { size: MAIN_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
        borders: noBorders,
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 120, bottom: 120, left: 240, right: 180 },
        children: main,
      }),
    ],
  })],
  width: { size: CONTENT_W, type: WidthType.DXA },
  layout: TableLayoutType.FIXED,
  borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
});

const skills = [];
skills.push(new Paragraph({
  spacing: { before: 160, after: 70 },
  children: [new TextRun({ text: "KEY SKILLS & KEYWORDS", bold: true, size: 19, font: FONT, color: C.accentLight, allCaps: true })],
  border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.accentLight } },
}));

const skillData = [
  ["Product", "PRD writing · product discovery · user research & JTBD · user story mapping · roadmapping · OKRs · RICE · MVP scoping · SDLC · backlog mgmt"],
  ["Growth & Data", "activation & retention funnels · cohort analysis · A/B testing · North Star Metrics · product analytics · GTM strategy · AARRR"],
  ["AI / LLM", "LLM product design · AI agent workflows · prompt engineering · RAG · AI-assisted prototyping (Lovable, Cursor, Claude, GPT-4o, Gemini)"],
  ["Tools", "SQL · REST API · Supabase · Vercel · Sheets · Jira · Confluence · Notion · Figma · Miro · Mixpanel · Amplitude · GA · Hotjar · HubSpot · Agile/Scrum"],
];

for (const [label, detail] of skillData) {
  skills.push(new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [
      mt(`${label}: `, { size: 15, bold: true }),
      mt(detail, { size: 14, color: C.grayText }),
    ],
  }));
}

const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { width: A4_W, height: A4_H, orientation: "portrait" },
        margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      },
    },
    children: [mainTable, ...skills],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("Gokul_Srinivasan_CV_Visual.docx", buf);
  console.log("DOCX generated");
});
