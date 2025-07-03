export const generateAgentPrompt = (caseCard: string, language: string) => `
=== INPUTS YOU RECEIVE ===
1. CASE CARD (full text of the scenario, already generated in the previous step):
${caseCard}

=== YOUR TASK ===
Generate a single, self-contained **PERSONA SCRIPT** for the specific agent mentioned in the Case Card.

CRITICAL: You MUST use the exact agent details specified in the Case Card (name, position, background, expertise, etc.).
DO NOT create new names or positions - extract and use the information already provided in the case.

=== EXTRACTION REQUIREMENTS ===
• Find the agent's EXACT full name from the Case Card
• Find the agent's EXACT position/title from the Case Card
• Find the agent's background, expertise, and relationship details from the Case Card
• Use the case context to understand their role in the scenario
• Build the persona script around this specific character as defined in the case

=== OUTPUT RULES ===
• Output exactly the section marked PERSONA SCRIPT below—nothing else, no commentary.
• Keep the script **text-only** (no links, no images).
• Ensure everything fits within ~40 lines so it stays readable.
• Use bullet points or short paragraphs—concise but vivid.
• All details must be *consistent* with the Case Card (domain, data, constraints, and agent details).
• Do **NOT** reveal the hidden agenda unless the participant triggers it.
• Use ${language} language.

=== PERSONA SCRIPT FORMAT ===
==============================================================
PERSONA SCRIPT — [EXTRACT EXACT NAME FROM CASE CARD]
==============================================================

• **Role / Title** : [EXTRACT EXACT POSITION/TITLE FROM CASE CARD]
• **Department/Team** : [EXTRACT OR INFER FROM CASE CARD]
• **Short Bio (1 line)** : [Build from case background - years of experience, domain expertise]
• **Communication Style** : [e.g., blunt, detail-oriented, values data, defensive under pressure]

• **Primary Objective**
  - What the persona openly wants from the conversation based on their role in the case (1–2 lines).

• **Hidden Agenda**
  - Private motive or concern they will *not* reveal unless properly probed (derived from case context).

• **Knowledge Assets**
  - Key facts or data only this persona knows based on their position and the case details (3–4 bullets).

• **Opening Line**
  - First thing they say when the meeting starts, reflecting their personality and the case urgency (quoted).

• **Information Triggers**
  - If the participant **asks about metrics** → provide [summary based on case data and their expertise].
  - If the participant **questions root cause** → [how they respond based on their role and knowledge].
  - If the participant **offers blame** → [emotional reaction based on their position and relationship].
  - Add 1–3 more triggers relevant to their specific expertise and the case scenario.

• **Escalation Hook (minute ~15)**
  - A new fact or pressure the persona drops mid-meeting based on their insider knowledge (1 line).

• **Relevant Domain Vocabulary**
  - 4–6 terms or acronyms the persona naturally uses based on their expertise area (comma-separated).

• **Refusal Boundaries**
  - Topics the persona will refuse or deflect based on their position and authority level (e.g., budget authority, HR issues).

• **Tone & Length Guide for Chat Agent**
  - Stay in character as [EXACT NAME FROM CASE], respond in 1–3 sentences, reference case data when helpful, never mention "this is a simulation."

=== VALIDATION CHECKLIST ===
Before outputting, verify:
✓ Agent name matches exactly what's in the Case Card
✓ Agent position/title matches exactly what's in the Case Card
✓ Agent background and expertise align with case details
✓ All persona elements are consistent with the case scenario
✓ No contradictions between agent script and case information`;
