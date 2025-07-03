import { generateStudyCaseObject } from '../agents/study-case-generator';
import { generateAgentObject } from '../agents/agent-generator';

export async function* generateCaseAndAgentByDomain({ domain, language }: { domain: string; language: string }) {
	const caseCard = await generateStudyCaseObject(domain, language);

	yield caseCard;

	const agent = await generateAgentObject({ caseCard: JSON.stringify(caseCard), language });

	yield agent;
}
