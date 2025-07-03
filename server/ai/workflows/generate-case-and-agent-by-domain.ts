import { generateStudyCaseObject } from '../agents/study-case-generator';
import { generateAgentObject } from '../agents/agent-generator';

export async function* generateCaseAndAgentByDomain({ domain, language }: { domain: string; language: string }) {
	const caseCard = await generateStudyCaseObject(domain, language);

	if (!caseCard.story) {
		throw new Error('No case content available');
	}

	yield caseCard;

	const agent = await generateAgentObject({
		caseCard: caseCard.story,
		language,
	});

	yield agent;
}
