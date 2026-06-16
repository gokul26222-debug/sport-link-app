from fpdf import FPDF

LH = 4        # universal line height
BLH = 4       # bullet line height
FONT = 8      # body font size
BFONT = 8.5   # bold title font size
SEC_FONT = 9.5  # section title font size
GAP_SECTION = 2   # space before section title
GAP_AFTER_RULE = 1.5  # space after section rule
GAP_BETWEEN_JOBS = 1.5  # space between job blocks
GAP_AFTER_BULLET = 0.3  # space after each bullet

class CV(FPDF):
    def __init__(self):
        super().__init__()
        self.add_page()
        self.set_auto_page_break(auto=False)
        self.set_margins(14, 10, 14)
        self.set_y(10)

    def section_title(self, title):
        self.ln(GAP_SECTION)
        self.set_font("Helvetica", "B", SEC_FONT)
        self.cell(0, 5.5, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(80, 80, 80)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(GAP_AFTER_RULE)

    def job_header(self, title, date):
        self.set_font("Helvetica", "B", BFONT)
        title_w = self.get_string_width(title)
        self.cell(title_w + 2, LH + 0.5, title)
        self.set_font("Helvetica", "", FONT)
        self.cell(0, LH + 0.5, date, align="R", new_x="LMARGIN", new_y="NEXT")

    def bullet(self, text):
        self.set_font("Helvetica", "", FONT)
        x = self.get_x()
        self.cell(4, BLH, "-")
        self.multi_cell(self.w - self.r_margin - x - 4, BLH, text)
        self.ln(GAP_AFTER_BULLET)

    def project_header(self, title, subtitle):
        self.set_font("Helvetica", "B", BFONT)
        self.cell(0, LH + 0.5, title, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "I", 7.5)
        self.cell(0, LH, subtitle, new_x="LMARGIN", new_y="NEXT")

    def label_line(self, label, text, label_w=None):
        self.set_font("Helvetica", "B", FONT)
        if label_w is None:
            label_w = self.get_string_width(label) + 2
        self.cell(label_w, LH, label)
        self.set_font("Helvetica", "", FONT)
        self.multi_cell(self.w - self.r_margin - self.get_x(), LH, text)
        self.ln(GAP_AFTER_BULLET)

pdf = CV()

# QR code top-right
qr_size = 20
qr_x = pdf.w - pdf.r_margin - qr_size
qr_y = 10
pdf.image("/home/user/sport-link-app/portfolio_qr.png", x=qr_x, y=qr_y, w=qr_size, h=qr_size)
pdf.set_font("Helvetica", "", 5.5)
pdf.text(qr_x + 2, qr_y + qr_size + 2.5, "Scan for Portfolio")

# Header
header_w = qr_x - pdf.l_margin - 2
pdf.set_font("Helvetica", "B", 16)
pdf.cell(header_w, 8, "GOKUL SRINIVASAN", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(0.5)
pdf.set_font("Helvetica", "", 7.5)
pdf.cell(header_w, LH, "Product Marketing  |  Account Manager  |  Growth Marketing", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(0.5)
pdf.set_font("Helvetica", "", FONT)
pdf.cell(header_w, LH, "Paris, France  |  gokul26222@gmail.com  |  +33 7 45 43 23 95  |  linkedin.com/in/gokulsrini", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(header_w, LH, "Portfolio: portfolio-orcin-nu-xm2481apwv.vercel.app  |  Authorized to work in France", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(header_w, LH, "No sponsorship required", align="C", new_x="LMARGIN", new_y="NEXT")

# --- PROFESSIONAL EXPERIENCE ---
pdf.section_title("PROFESSIONAL EXPERIENCE")

pdf.job_header("Sales & Marketing Intern | iCell, Paris", "2025 - 2026 (part-time, alongside MSc)")
pdf.bullet("Designed and tested 15+ content campaigns across 3 seasonal pushes; weekly competitor tracking across 8 brands directly shaped pricing and promotional decisions")
pdf.bullet("Mapped acquisition funnel from social ad to in-store conversion, identified a consideration-phase drop-off, and drafted a retargeting brief that closed the gap")
pdf.bullet("Produced organic content across Instagram and TikTok, adapting format and tone (story, post, reel) based on platform-specific engagement data")

pdf.ln(GAP_BETWEEN_JOBS)
pdf.job_header("Customer Success Manager | Octopus Era, Paris", "2023 - 2024")
pdf.bullet("Managed a EUR 16K+ client portfolio across digital marketing mandates; maintained 90%+ on-time delivery through structured account plans and proactive escalation management")
pdf.bullet("Drove 20%+ account expansion by converting OKR-aligned QBR insights and client usage data into targeted upsell proposals")
pdf.bullet("Built onboarding playbooks and escalation workflows that cut first-response time and improved CSAT across all active accounts")

pdf.ln(GAP_BETWEEN_JOBS)
pdf.job_header("Product Support Engineer | Vxceed Software Solutions, Bengaluru", "2021 - 2022")
pdf.bullet("Resolved 50+ critical client escalations, protecting EUR 220K+ in enterprise revenue; built a 50-entry knowledge base that cut repeat issues by ~33%")
pdf.bullet("Translated 12 recurring client complaints into 3 shipped product fixes by structuring voice-of-customer feedback for the engineering team")
pdf.bullet("Led UAT sessions and coordinated zero-regression releases, bridging client needs with engineering execution")

# --- PROJECTS ---
pdf.section_title("PROJECTS")

pdf.project_header("Cleo: AI guide for international students in France", "User Research | GTM | 0-to-1 Launch | Private Beta    Live: cleo-app-theta.vercel.app")
pdf.bullet("Identified an underserved segment of 400K+ international students/yr with no structured guide for CAF, CPAM, OFII and banking")
pdf.bullet("Validated via 8 interviews + 40-person survey: 82% missed at least one administrative deadline in their first 3 months")
pdf.bullet("Defined ICP, positioned for organic word-of-mouth within student communities, launched to private beta. Core value prop: a 7-day action plan replacing a 3-month fragmented process")

pdf.ln(GAP_BETWEEN_JOBS)
pdf.project_header("PlayPal: sports matchmaking app for local game discovery", "Market Research | Segmentation | Community GTM | Private Beta    Live: sport-link-app.lovable.app")
pdf.bullet("12 user interviews + 47-person survey surfaced the real gap: not a scheduler but a \"who's playing near me now\" discovery layer. ICP: young expats and active professionals in Paris")
pdf.bullet("Launched via community seeding across sports clubs, badminton groups and expat networks; iterating on activation rate and D7 retention as primary growth levers")

# --- STRATEGY CASE STUDIES ---
pdf.section_title("STRATEGY CASE STUDIES (full versions in portfolio)")

CASE_LABEL_W = 22
pdf.set_font("Helvetica", "B", FONT)
pdf.cell(CASE_LABEL_W, BLH, "PhotoRoom")
pdf.set_font("Helvetica", "", FONT)
pdf.multi_cell(0, BLH, "(GTM & pricing): Diagnosed revenue model misalignment between flat subscriptions and rising AI costs; designed a 3-tier monetisation approach to protect margin without losing core users")
pdf.ln(GAP_AFTER_BULLET)

pdf.set_font("Helvetica", "B", FONT)
pdf.cell(CASE_LABEL_W, BLH, "Joko")
pdf.set_font("Helvetica", "", FONT)
pdf.multi_cell(0, BLH, "(retention & engagement): Redesigned the milestone progress loop to break a 30-day churn pattern and shift 4M+ users from weekly to daily engagement through personalised reward cadence")
pdf.ln(GAP_AFTER_BULLET)

pdf.set_font("Helvetica", "B", FONT)
pdf.cell(CASE_LABEL_W, BLH, "Netflix")
pdf.set_font("Helvetica", "", FONT)
pdf.multi_cell(0, BLH, "(Gen Z growth): 5-lever behavioural growth framework including a short-form clips feed to convert passive scroll into full-title viewing and re-engage Gen Z (270M+ subscribers)")

# --- SKILLS & TOOLS ---
pdf.section_title("SKILLS & TOOLS")

SKILL_LABEL_W = 28
for label, items in [
    ("Marketing & GTM:", "Campaign design & testing, GTM strategy, content strategy, market segmentation, competitor intelligence, brand positioning, community-led growth, A/B testing, AARRR"),
    ("Client & Account:", "Portfolio management, account expansion, QBR facilitation, client onboarding, upsell strategy, stakeholder communication, CRM (HubSpot)"),
    ("Analytics:", "Google Analytics, Mixpanel, Hotjar, cohort analysis, KPI & North Star definition, funnel analysis, retention metrics, Excel / Google Sheets (advanced)"),
    ("Tools:", "Notion, Figma, Canva, SQL, Instagram, TikTok, Jira, Miro, Amplitude, Agile/Scrum"),
]:
    pdf.label_line(label, items, SKILL_LABEL_W)

# --- EDUCATION & CERTIFICATIONS ---
pdf.section_title("EDUCATION & CERTIFICATIONS")

pdf.job_header("MSc International Business | EMLV Grande Ecole (triple-accredited), Paris", "2023 - 2025")
pdf.job_header("B.E. Construction Engineering | Jerusalem College of Engineering, Chennai", "2017 - 2021")
pdf.ln(1)

EDU_LABEL_W = 22
pdf.label_line("Certifications:", "HubSpot Inbound & Sales | Agile Project Management (PMI France, 2025) | Product Prioritization (Product School, 2025)", EDU_LABEL_W)
pdf.label_line("Languages:", "English: fluent (C2) | Tamil: native | French: A2+, in active training", EDU_LABEL_W)

pdf.output("/home/user/sport-link-app/Gokul_Srinivasan_CV.pdf")
print("PDF generated successfully")
print(f"Pages: {pdf.pages_count}")
