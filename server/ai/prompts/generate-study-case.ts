export const generateStudyCasePrompt = (domain: string, language: string) => (`
Please generate a complete Case Card setup using the structure below, based on the following inputs:

Inputs:
- Domain: ${domain}
- Language: ${language}
- Target skills to assess or improve: [INSERT 2–4 COMPETENCIES FROM LIST BELOW]

Competency Options (pick the most relevant ones for the situation):
A. Analytical Problem-Solving
B. Planning & Execution
C. Communication & Presence
D. Team Leadership & Collaboration
E. Stakeholder & Business Orientation
F. Self-Reflection & Growth Mindset

Requirements:
- The exercise must involve a 25-minute conversation with one fictional persona only (no additional team or stakeholders).
- Do not include visual materials or links; all data and context must be text-based.
- You MUST create a specific agent persona with a realistic full name and detailed position/role.
- The participant must be put into the role of a Team Lead or PM and required to make a non-trivial decision.
- The case must include explicit success criteria (decision + quality bar + constraints).
- Use data tables or bullet lists to simulate metrics and project status in plain text.
- Keep it under ~60 lines so it fits within a single document or screen.
- The agent persona details must be prominently featured in the case story.

Output Format (use this structure exactly):

==============================================================
CASE CARD — [Generated Title]
==============================================================

1. PROJECT SNAPSHOT
   • Product: [short fictional product name or service]
   • Goal   : [one-sentence project objective]
   • Key KPI: [metric name] — Target: [value] — Current: [value]

2. CURRENT STATUS (TEXT-ONLY DATA PACK)
   • Metric trend:
       | Day | KPI value |
       |-----|-----------|
       | Mon |           |
       | Tue |           |
       | Wed |           |
       | Thu |           |
   • Open risks:
       1. [Risk 1 — owner — due date]
       2. [Risk 2 — owner — due date]
   • Context note:
       "VP of [fictional name] wants a decision by [hard deadline]."

3. YOUR ROLE
   You are the [Team Lead / Project Manager] for this initiative. You have 25 minutes to speak with your counterpart to understand the problem, choose a course of action, and document a path forward.

4. THE CONVERSATION
   • Counterpart  : [SPECIFIC FULL NAME], [SPECIFIC DETAILED POSITION/TITLE]
   • Background   : [Brief 1-2 sentence background about this person's expertise and role in the situation]
   • Time box     : 25 minutes
   • Meeting goal : Diagnose the problem and propose a clear path forward.
   • Context      : [Why this specific person is the right counterpart for this conversation]

5. AGENT PERSONA DETAILS
   • Full Name: [Create a realistic, professional full name]
   • Position/Title: [Specific role like "Senior Backend Engineer", "QA Lead", "UX Design Manager", etc.]
   • Department: [Which team/department they work in]
   • Expertise: [Their specific area of expertise relevant to this case]
   • Relationship: [How they relate to the project and the participant's role]

6. SUCCESS CRITERIA
   • Decision and rationale are clearly recorded (e.g., Option A vs. Option B).
   • Action plan with owners and dates (≥ 2 steps).
   • Outcome is communicated within 25 mins using ≤ 15 lines of plain text.

7. DELIVERABLE
   At the end, summarize your decision and next steps for observers (verbally or in writing).

8. CONSTRAINTS
   • Budget cap    : [value or qualitative limit]
   • Policy limit  : [e.g., must stay GDPR compliant, max infra servers, etc.]
   • Time pressure : [e.g., release must stay on track for beta next week]

• Use ${language} language.
• Ensure the agent persona details are specific, realistic, and directly relevant to the case scenario.
• The agent's name and position must be consistently referenced throughout the case story.
`);
