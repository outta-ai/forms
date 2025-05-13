"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { Form, Response } from "@/payload-types";

import { type Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ky from "ky";

import { Button } from "@/components/ui/button";
import { EmailInput } from "../_components/EmailInput";
import { MultipleSelectInput } from "../_components/MultipleSelectInput";
import { NumberInput } from "../_components/NumberInput";
import { SingleSelectInput } from "../_components/SingleSelectInput";
import { TelephoneInput } from "../_components/TelephoneInput";
import { TextareaInput } from "../_components/TextareaInput";
import { TextInput } from "../_components/TextInput";
import { InputContext } from "../_contexts/InputContext";
import { ErrorView } from "./ErrorView";
import { FinishView } from "./FinishView";

type Props = {
	form: Form;
	responseId: string;
};

export function ClientQuestionView({ form, responseId }: Props) {
	const [finishedQuestions, setFinishedQuestions] = useState<string[]>([]);

	const result = useMemo(() => {
		if (!form.sections) return "no_sections" as const;

		for (const section of form.sections) {
			if (!section.questions) continue;

			const remainingQuestions = section.questions.filter(
				(q) => !finishedQuestions.includes(q.id || ""),
			);

			if (remainingQuestions.length === 0) {
				continue;
			}

			if (section.random) {
				remainingQuestions.sort(() => Math.random() - 0.5);
			}

			return [section, remainingQuestions[0]] as const;
		}

		const totalQuestions = form.sections.flatMap((s) => s.questions);
		if (totalQuestions.length === finishedQuestions.length) {
			return "finished" as const;
		}

		return "no_questions" as const;
	}, [form, finishedQuestions]);

	const sectionDescription =
		typeof result === "string"
			? undefined
			: (result[0].description as Content[] | undefined | null);

	const editor = useEditor(
		{
			extensions: [StarterKit],
			content: sectionDescription ? sectionDescription[0] : undefined,
			editorProps: {
				attributes: {
					class:
						"max-w-full prose prose-sm sm:prose-base lg:prose-lg font-pretendard focus:outline-none py-4 *:leading-normal",
				},
			},
			editable: false,
		},
		[sectionDescription],
	);

	const [valid, setValid] = useState(false);
	const [value, setValue] = useState<string>("");
	const [optional, setOptional] = useState(false);
	const [shown] = useState(new Date());

	const saveResponse = useCallback(async () => {
		if (typeof result === "string") return;
		const [_, question] = result;

		const questionId = question.id;
		if (!valid || !questionId) return;

		const res = await ky.get(`/api/response/${responseId}`);
		const data = await res.json<Response>();
		const existingData = data.data || [];
		const removedData = existingData.filter((d) => d.question !== questionId);

		await ky.patch(`/api/response/${responseId}`, {
			json: {
				data: [
					...removedData,
					{
						question: questionId,
						answer: value,
						shownAt: shown.toISOString(),
						submittedAt: new Date().toISOString(),
					},
				],
			} satisfies Partial<Response>,
		});
		setValue("");
		setValid(false);
		setFinishedQuestions((value) => [...value, questionId]);
	}, [valid, result, responseId, shown, value]);

	useEffect(() => {
		if (typeof result === "string") return;
		const [_, question] = result;

		setOptional(!!question.optional);
		if (question.optional) {
			setValid(true);
		}
	}, [result]);

	if (result === "no_sections") {
		return <ErrorView errorId="no_sections" />;
	}

	if (result === "no_questions") {
		return <ErrorView errorId="no_questions" />;
	}

	if (result === "finished") {
		return <FinishView form={form} responseId={responseId} />;
	}

	const [section, question] = result;

	return (
		<InputContext.Provider value={{ value, setValue, setValid, optional }}>
			<div className="w-full h-full [&&]:h-dvh py-3 md:py-12 px-3 md:px-6">
				<div className="container mx-auto flex flex-col h-full">
					<div className="flex-1 overflow-y-auto">
						<h1 className="text-2xl font-bold">{section.title}</h1>
						<EditorContent editor={editor} />
						<div className="mt-6">
							<h2 className="text-lg font-bold">{question.question}</h2>
							{(() => {
								switch (question.type) {
									case "text":
										return <TextInput className="mt-3" />;
									case "number":
										return <NumberInput className="mt-3" />;
									case "email":
										return <EmailInput className="mt-3" />;
									case "tel":
										return <TelephoneInput className="mt-3" />;
									case "textarea":
										return <TextareaInput className="mt-3" />;
									case "single_choice":
										return (
											<SingleSelectInput
												className="mt-3"
												option={question.options}
											/>
										);
									case "multiple_choice":
										return (
											<MultipleSelectInput
												className="mt-3"
												option={question.options}
											/>
										);
									default:
										return null;
								}
							})()}
						</div>
					</div>
					<div className="shrink-0 flex border-t border-muted-foreground py-3">
						<div className="flex-1" />
						<Button onClick={saveResponse} disabled={!valid}>
							다음
						</Button>
					</div>
				</div>
			</div>
		</InputContext.Provider>
	);
}
