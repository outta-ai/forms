import type { Form, Response } from "@/payload-types";

import { ErrorView } from "./ErrorView";
import { QuestionView } from "./QuestionView";
import { StartView } from "./StartView";
import { FinishView } from "./FinishView";

type Props = {
	form: Form;
	response?: Response;
	start: boolean;
	formPath: string;
	userId?: string;
};

export async function FormView({
	form,
	response,
	start,
	formPath,
	userId,
}: Props) {
	if (!form.sections) {
		return <ErrorView errorId="no_sections" />;
	}

	if (form.settings?.disable_new_response) {
		return <ErrorView errorId="no_new_responses" />;
	}

	if (!response?.data) {
		return <StartView form={form} formPath={formPath} />;
	}

	if (response.data.length === 0 && !start) {
		return (
			<StartView form={form} formPath={formPath} responseId={response.id} />
		);
	}

	if (response.finished) {
		return <FinishView form={form} responseId={response.id} />;
	}

	const completedQuestions = response.data.map((q) => q.question);

	for (const section of form.sections) {
		if (!section.questions) continue;

		const remainingQuestions = section.questions.filter(
			(q) => !completedQuestions.includes(q.id || ""),
		);

		if (remainingQuestions.length === 0) {
			continue;
		}

		if (section.random) {
			remainingQuestions.sort(() => Math.random() - 0.5);
		}

		return (
			<QuestionView
				responseId={response.id}
				section={section}
				question={remainingQuestions[0]}
			/>
		);
	}

	const totalQuestions = form.sections.flatMap((s) => s.questions);
	if (totalQuestions.length === completedQuestions.length) {
		return <FinishView form={form} responseId={response.id} />;
	}

	return <ErrorView errorId="no_questions" />;
}
