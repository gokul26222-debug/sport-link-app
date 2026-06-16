from fpdf import FPDF

class CV(FPDF):
    def __init__(self):
        super().__init__()
        self.add_page()
        self.set_auto_page_break(auto=False)
        self.set_margins(14, 10, 14)
        self.set_y(10)

    def section_title(self, title):
        self.ln(2)
        self.set_font("Helvetica", "B", 9.5)
        self.cell(0, 5.5, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(80, 80, 80)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(1.5)

    def job_header(self, title, date):
        self.set_font("Helvetica", "B", 8.5)
        title_w = self.get_string_width(title)
        self.cell(title_w + 2, 4.5, title)
        self.set_font("Helvetica", "", 8)
        self.cell(0, 4.5, date, align="R", new_x="LMARGIN", new_y="NEXT")

    def bullet(self, text):
        self.set_font("Helvetica", "", 8)
        x = self.get_x()
        self.cell(4, 4, "-")
        self.multi_cell(self.w - self.r_margin - x - 4, 4, text)
        self.ln(0.3)

pdf = CV()

# QR code top-right (placed first so text avoids it)
qr_size = 20
qr_x = pdf.w - pdf.r_margin - qr_size
qr_y = 10
pdf.image("/home/user/sport-link-app/portfolio_qr.png", x=qr_x, y=qr_y, w=qr_size, h=qr_size)
pdf.set_font("Helvetica", "", 5.5)
pdf.text(qr_x + 2, qr_y + qr_size + 2.5, "Scan for Portfolio")

# Header - keep text within left area so it doesn't overlap QR
header_w = qr_x - pdf.l_margin - 2
pdf.set_font("Helvetica", "B", 16)
pdf.cell(header_w, 8, "GOKUL SRINIVASAN", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(0.5)
pdf.set_font("Helvetica", "", 8)
pdf.cell(header_w, 4, "Paris, France  |  gokul26222@gmail.com  |  +33 7 45 43 23 95  |  linkedin.com/in/gokulsrini", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(header_w, 4, "Portfolio: portfolio-orcin-nu-xm2481apwv.vercel.app  |  Authorized to work in France", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(header_w, 4, "No sponsorship required", align="C", new_x="LMARGIN", new_y="NEXT")

# Professional Experience
pdf.section_title("PROFESSIONAL EXPERIENCE")

pdf.job_header("Sales & Marketing Intern | iCell, Paris", "2025 - 2026 (part-time, alongside MSc)")
pdf.bullet("Designed and tested 15+ content campaigns across 3 seasonal pushes; weekly competitor tracking across 8 brands directly shaped pricing and promotional decisions")
pdf.bullet("Mapped acquisition funnel from social ad to in-store conversion, identified a consideration-phase drop-off, and drafted a retargeting brief that closed the gap")
pdf.bullet("Produced organic content across Instagram and TikTok, adapting format and tone (story, post, reel) based on platform-specific engagement data")

pdf.ln(1.5)
pdf.job_header("Customer Success Manager | Octopus Era, Paris", "2023 - 2024")
pdf.bullet("Managed a EUR 16K+ client portfolio across digital marketing mandates; maintained 90%+ on-time delivery through structured account plans and proactive escalation management")
pdf.bullet("Drove 20%+ account expansion by converting OKR-aligned QBR insights and client usage data into targeted upsell proposals")
pdf.bullet("Built onboarding playbooks and escalation workflows that cut first-response time and improved CSAT across all active accounts")

pdf.ln(1.5)
pdf.job_header("Product Support Engineer | Vxceed Software Solutions, Bengaluru", "2021 - 2022")
pdf.bullet("Resolved 50+ critical client escalations, protecting EUR 220K+ in enterprise revenue; built a 50-entry knowledge base that cut repeat issues by ~33%")
pdf.bullet("Translated 12 recurring client complaints into 3 shipped product fixes by structuring voice-of-customer feedback for the engineering team")
pdf.bullet("Led UAT sessions and coordinated zero-regression releases, bridging client needs with engineering execution")

# Projects
pdf.section_title("PROJECTS")

pdf.set_font("Helvetica", "B", 8.5)
pdf.cell(0, 4.5, "Cleo: AI guide for international students in France", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "I", 7.5)
pdf.cell(0, 4, "User Research | GTM | 0-to-1 Launch | Private Beta    Live: cleo-app-theta.vercel.app", new_x="LMARGIN", new_y="NEXT")
pdf.bullet("Identified an underserved segment of 400K+ international students/yr with no structured guide for CAF, CPAM, OFII and banking")
pdf.bullet("Validated via 8 interviews + 40-person survey: 82% missed at least one administrative deadline in their first 3 months")
pdf.bullet("Defined ICP, positioned for organic word-of-mouth within student communities, launched to private beta. Core value prop: a 7-day action plan replacing a 3-month fragmented process")

pdf.ln(1.5)
pdf.set_font("Helvetica", "B", 8.5)
pdf.cell(0, 4.5, "PlayPal: sports matchmaking app for local game discovery", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "I", 7.5)
pdf.cell(0, 4, "Market Research | Segmentation | Community GTM | Private Beta    Live: sport-link-app.lovable.app", new_x="LMARGIN", new_y="NEXT")
pdf.bullet("12 user interviews + 47-person survey surfaced the real gap: not a scheduler but a \"who's playing near me now\" discovery layer. ICP: young expats and active professionals in Paris")
pdf.bullet("Launched via community seeding across sports clubs, badminton groups and expat networks; iterating on activation rate and D7 retention as primary growth levers")

# Strategy Case Studies
pdf.section_title("STRATEGY CASE STUDIES (full versions in portfolio)")

pdf.set_font("Helvetica", "B", 8)
pdf.cell(22, 4, "PhotoRoom")
pdf.set_font("Helvetica", "", 8)
pdf.multi_cell(0, 4, "(GTM & pricing): Diagnosed revenue model misalignment between flat subscriptions and rising AI costs; designed a 3-tier monetisation approach to protect margin without losing core users")
pdf.ln(0.5)
pdf.set_font("Helvetica", "B", 8)
pdf.cell(10, 4, "Joko")
pdf.set_font("Helvetica", "", 8)
pdf.multi_cell(0, 4, "(retention & engagement): Redesigned the milestone progress loop to break a 30-day churn pattern and shift 4M+ users from weekly to daily engagement through personalised reward cadence")
pdf.ln(0.5)
pdf.set_font("Helvetica", "B", 8)
pdf.cell(13, 4, "Netflix")
pdf.set_font("Helvetica", "", 8)
pdf.multi_cell(0, 4, "(Gen Z growth): 5-lever behavioural growth framework including a short-form clips feed to convert passive scroll into full-title viewing and re-engage Gen Z (270M+ subscribers)")

# Skills
pdf.section_title("SKILLS & TOOLS")

for label, items in [
    ("Marketing & GTM:", "Campaign design & testing, GTM strategy, content strategy, market segmentation, competitor intelligence, brand positioning, community-led growth, A/B testing, AARRR"),
    ("Client & Account:", "Portfolio management, account expansion, QBR facilitation, client onboarding, upsell strategy, stakeholder communication, CRM (HubSpot)"),
    ("Analytics:", "Google Analytics, Mixpanel, Hotjar, cohort analysis, KPI & North Star definition, funnel analysis, retention metrics, Excel / Google Sheets (advanced)"),
    ("Tools:", "Notion, Figma, Canva, SQL, Instagram, TikTok, Jira, Miro, Amplitude, Agile/Scrum"),
]:
    pdf.set_font("Helvetica", "B", 8)
    lw = pdf.get_string_width(label) + 2
    pdf.cell(lw, 4, label)
    pdf.set_font("Helvetica", "", 8)
    pdf.multi_cell(pdf.w - pdf.r_margin - pdf.get_x(), 4, items)
    pdf.ln(0.3)

# Education
pdf.section_title("EDUCATION & CERTIFICATIONS")

pdf.job_header("MSc International Business | EMLV Grande Ecole (triple-accredited), Paris", "2023 - 2025")
pdf.job_header("B.E. Construction Engineering | Jerusalem College of Engineering, Chennai", "2017 - 2021")
pdf.ln(1)

pdf.set_font("Helvetica", "B", 8)
pdf.cell(20, 4, "Certifications:")
pdf.set_font("Helvetica", "", 8)
pdf.multi_cell(0, 4, "HubSpot Inbound & Sales | Agile Project Management (PMI France, 2025) | Product Prioritization (Product School, 2025)")
pdf.ln(0.3)

pdf.set_font("Helvetica", "B", 8)
pdf.cell(16, 4, "Languages:")
pdf.set_font("Helvetica", "", 8)
pdf.cell(0, 4, "English: fluent (C2) | Tamil: native | French: A2+, in active training")

pdf.output("/home/user/sport-link-app/Gokul_Srinivasan_CV.pdf")
print("PDF generated successfully")
print(f"Pages: {pdf.pages_count}")
