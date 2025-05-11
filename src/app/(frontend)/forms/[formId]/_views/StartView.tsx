"use client";

import { useCallback } from "react";

import type { Form } from "@/payload-types";

import { useSession } from "next-auth/react";
import { type Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ky from "ky";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
	form: Form;
	responseId?: string;
	formPath: string;
};

export function StartView({ form, responseId, formPath }: Props) {
	const router = useRouter();
	const { data: session } = useSession();

	const description = form.description as Content[] | undefined | null;

	const editor = useEditor({
		extensions: [StarterKit],
		content: description ? description[0] : undefined,
		editorProps: {
			attributes: {
				class:
					"max-w-full prose prose-sm sm:prose-base lg:prose-lg font-pretendard focus:outline-none py-4 *:leading-normal",
			},
		},
		editable: false,
	});

	const onStart = useCallback(async () => {
		if (!responseId) {
			await ky.post<Response>("/api/response", {
				json: {
					form: form.id,
					user: session?.user.payload_id,
				},
			});
		}
		router.replace(`/forms/${formPath}?start`);
	}, [router, formPath, responseId, session?.user.payload_id, form.id]);

	return (
		<div className="w-full h-full [&&]:h-screen py-3 md:py-12 px-3 md:px-6">
			<div className="container mx-auto flex flex-col h-full">
				<div className="flex-1 overflow-y-auto">
					<h1 className="text-2xl font-bold">{form.name}</h1>
					<EditorContent editor={editor} />
				</div>
				<div className="shrink-0 flex border-t border-muted-foreground py-3">
					<div className="flex-1" />
					<Button onClick={onStart}>시작하기</Button>
				</div>
			</div>
		</div>
	);
}
