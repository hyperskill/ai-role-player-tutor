import { generateStudyCase, generateStudyCaseObject } from '../agents/study-case-generator';
import { generatePersona, generatePersonaObject } from '../agents/agent-generator';

export async function* generateCaseAndAgentByDomain({ domain }: { domain: string }) {
	const caseCard = await generateStudyCase({ domain });
	const caseObject = await generateStudyCaseObject(caseCard);

	yield caseObject;

	const persona = await generatePersona({ caseCard });
	const personaObject = await generatePersonaObject(persona);

	yield personaObject;
}
