"use client";

import { useEffect, useId, useRef } from "react";

import { useField } from "@payloadcms/ui";
import type { RichTextFieldClientProps } from "payload";

import { type Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { AttachmentUploadResult } from "./extensions/image";

import {
	Bold,
	Code,
	FileCode,
	Image,
	Italic,
	List,
	ListOrdered,
	Strikethrough,
} from "lucide-react";

import "./tiptap.css";

export default function TiptapEditorField({
	path,
	field,
}: RichTextFieldClientProps) {
	const id = useId();
	const { value, setValue } = useField<[Content]>({ path });

	const editor = useEditor({
		extensions: [StarterKit],
		content: value?.length > 0 ? value[0] : undefined,
		editorProps: {
			attributes: {
				id,
				class:
					"max-w-full prose prose-sm sm:prose-base lg:prose-lg font-pretendard focus:outline-none p-4 min-h-64 *:leading-normal",
			},
		},
		immediatelyRender: false,
	});

	const [savedDelay, cancelSavedDelay] = useDebounce(
		() => setValue(editor ? [editor.getJSON()] : []),
		3000,
		[editor?.getJSON()],
	);

	useEffect(() => {
		if (!editor) return;
		savedDelay();
	}, [editor, savedDelay]);

	const imageInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="w-full field-type">
			<label className="field-label" htmlFor={id}>
				{typeof field.label === "object"
					? field.label[Object.keys(field.label)[0]]
					: field.label}
			</label>
			<div className="border border-[#e5e7eb] shadow-payload-input hover:shadow-payload-input-hover">
				<div className="flex border-b">
					<button
						type="button"
						className={cn(
							"p-4 bg-white border-none outline-none hover:bg-zinc-100",
							editor?.isActive("bold") ? "bg-zinc-300" : "",
						)}
						onClick={() => editor?.chain().focus().toggleBold().run()}
					>
						<Bold className="w-4 h-4 font-bold" />
					</button>
					<button
						type="button"
						className={cn(
							"p-4 bg-white border-none outline-none hover:bg-zinc-100",
							editor?.isActive("italic") ? "bg-zinc-300" : "",
						)}
						onClick={() => editor?.chain().focus().toggleItalic().run()}
					>
						<Italic className="w-4 h-4" />
					</button>
					<button
						type="button"
						className={cn(
							"p-4 bg-white border-none outline-none hover:bg-zinc-100",
							editor?.isActive("strike") ? "bg-zinc-300" : "",
						)}
						onClick={() => editor?.chain().focus().toggleStrike().run()}
					>
						<Strikethrough className="w-4 h-4" />
					</button>
					<button
						type="button"
						className={cn(
							"p-4 bg-white border-none outline-none hover:bg-zinc-100",
							editor?.isActive("code") ? "bg-zinc-300" : "",
						)}
						onClick={() => editor?.chain().focus().toggleCode().run()}
					>
						<Code className="w-4 h-4" />
					</button>
					<button
						type="button"
						className={cn(
							"p-4 bg-white border-none outline-none hover:bg-zinc-100",
							editor?.isActive("codeblock") ? "bg-zinc-300" : "",
						)}
						onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
					>
						<FileCode className="w-4 h-4" />
					</button>
					<button
						type="button"
						className={cn(
							"p-4 bg-white border-none outline-none hover:bg-zinc-100",
							editor?.isActive("bulletList") ? "bg-zinc-300" : "",
						)}
						onClick={() => editor?.chain().focus().toggleBulletList().run()}
					>
						<List className="w-4 h-4" />
					</button>
					<button
						type="button"
						className={cn(
							"p-4 bg-white border-none outline-none hover:bg-zinc-100",
							editor?.isActive("orderedList") ? "bg-zinc-300" : "",
						)}
						onClick={() => editor?.chain().focus().toggleOrderedList().run()}
					>
						<ListOrdered className="w-4 h-4" />
					</button>
					<button
						type="button"
						className={cn(
							"p-4 bg-white border-none outline-none hover:bg-zinc-100",
							editor?.isActive("image") ? "bg-zinc-300" : "",
						)}
						onClick={() => imageInputRef.current?.click()}
					>
						<Image className="w-4 h-4" />
					</button>
					<input
						type="file"
						accept="image/*"
						ref={imageInputRef}
						className="hidden"
						onChange={async (e) => {
							const file = e.target.files?.item(0);
							if (!file) return;
							const formData = new FormData();
							formData.append("file", file);
							formData.append("name", crypto.randomUUID());
							const response = await fetch("/api/attachments", {
								method: "POST",
								body: formData,
							});
							if (!response.ok) return;
							const textData = await response.text();

							const attachement = (() => {
								try {
									return JSON.parse(textData);
								} catch {
									return undefined;
								}
							})();

							const zodResult = AttachmentUploadResult.safeParse(attachement);
							if (!zodResult.success) {
								console.error(zodResult.error);
								return;
							}

							editor
								?.chain()
								.focus()
								.setImage({ src: zodResult.data.doc.url })
								.run();
						}}
					/>
				</div>
				<EditorContent
					editor={editor}
					onBlur={() => {
						cancelSavedDelay();
						setValue(editor ? [editor.getJSON()] : []);
					}}
				/>
			</div>
		</div>
	);
}
