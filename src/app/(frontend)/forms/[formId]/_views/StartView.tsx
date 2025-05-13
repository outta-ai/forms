"use client";

import { useCallback, useEffect } from "react";

import type { Form } from "@/payload-types";

import { type Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ky from "ky";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
	form: Form;
	responseId?: string;
	formPath: string;
	userId?: string;
};

export function StartView({ form, responseId, formPath, userId }: Props) {
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

	useEffect(() => {
		if (typeof window === "undefined") return;

		if (!userId) {
			const timestamp = Math.floor(Date.now() / 1000)
				.toString(16)
				.padStart(8, "0");
			const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(8)))
				.map((byte) => byte.toString(16).padStart(2, "0"))
				.join("");
			const userId = timestamp + randomBytes;
			document.cookie = `OUTTA_FORMS_USER_ID=${userId}; path=/; max-age=31536000; SameSite=Lax`;

			router.refresh();
		}
	}, [router, userId]);

	const onStart = useCallback(async () => {
		if (!responseId) {
			await ky.post<Response>("/api/response", {
				json: {
					form: form.id,
					user: session?.user.payload_id || userId,
				},
			});
		}
		router.replace(`/forms/${formPath}?start`);
	}, [router, formPath, responseId, session, userId, form.id]);

	return (
		<div className="w-full h-full [&&]:h-dvh py-3 md:py-12 px-3 md:px-6">
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
