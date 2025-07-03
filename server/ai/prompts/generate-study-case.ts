export const generateStudyCasePrompt = (domain: string) => (`You are a case-design assistant for leadership assessments. Your job is to create structured, text-only case scenarios for evaluating junior and middle-level team leads or project managers using live dialogue-based exercises.

Please generate a complete Case Card setup using the structure below, based on the following inputs:

Inputs:
- Domain: ${domain}
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
- Do not write the full persona script yet—just give the persona's name and role.
- The participant must be put into the role of a Team Lead or PM and required to make a non-trivial decision.
- The case must include explicit success criteria (decision + quality bar + constraints).
- Use data tables or bullet lists to simulate metrics and project status in plain text.
- Keep it under ~60 lines so it fits within a single document or screen.

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
       “VP of [fictional name] wants a decision by [hard deadline].”

3. YOUR ROLE
   You are the [Team Lead / Project Manager] for this initiative. You have 25 minutes to speak with *[Persona Name]* to understand the problem, choose a course of action, and document a path forward.

4. THE CONVERSATION
   • Counterpart  : *[Persona Name], Senior [Discipline]*
   • Time box     : 25 minutes
   • Meeting goal : Diagnose the problem and propose a clear path forward.

5. SUCCESS CRITERIA
   6. Decision and rationale are clearly recorded (e.g., Option A vs. Option B).
   7. Action plan with owners and dates (≥ 2 steps).
   8. Outcome is communicated within 25 mins using ≤ 15 lines of plain text.

9. DELIVERABLE
   At the end, summarize your decision and next steps for observers (verbally or in writing).

10. CONSTRAINTS
   • Budget cap    : [value or qualitative limit]
   • Policy limit  : [e.g., must stay GDPR compliant, max infra servers, etc.]
   • Time pressure : [e.g., release must stay on track for beta next week]
`);
