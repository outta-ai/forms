import { hexToBase64URL } from "@/lib/utils";
import type { CollectionConfig } from "payload";

export const Form: CollectionConfig = {
	slug: "form",
	fields: [
		{
			type: "text",
			name: "name",
			required: true,
		},
		{
			type: "text",
			name: "custom_slug",
			label: "URL 경로",
			admin: {
				description:
					"접근 URL 경로입니다 (https://forms.outta.ai/forms/[slug]). 지정되지 않은 경우 자동으로 생성됩니다",
			},
		},
		{
			type: "richText",
			name: "description",
			admin: {
				components: {
					Field: "@/components/TiptapEditor/Field",
				},
			},
		},
		{
			type: "array",
			name: "sections",
			fields: [
				{
					type: "text",
					name: "title",
					required: true,
				},
				{
					type: "richText",
					name: "description",
					admin: {
						components: {
							Field: "@/components/TiptapEditor/Field",
						},
					},
				},
				{
					type: "checkbox",
					name: "random",
					label: "질문 순서 섞기",
				},
				{
					type: "array",
					name: "questions",
					fields: [
						{
							type: "text",
							name: "question",
							required: true,
						},
						{
							type: "select",
							name: "type",
							required: true,
							options: [
								{ label: "텍스트", value: "text" },
								{ label: "숫자", value: "number" },
								{ label: "이메일", value: "email" },
								{ label: "전화번호", value: "tel" },
								{ label: "텍스트 영역", value: "textarea" },
								{ label: "단일 선택", value: "single_choice" },
								{ label: "다중 선택", value: "multiple_choice" },
							],
						},
						{
							type: "relationship",
							name: "options",
							relationTo: "option",
							admin: {
								condition: (_, data) =>
									data?.type === "single_choice" ||
									data?.type === "multiple_choice",
							},
							hooks: {
								beforeChange: [
									({ siblingData, value }) => {
										if (
											siblingData?.type === "single_choice" ||
											siblingData?.type === "multiple_choice"
										) {
											return value;
										}
										return null;
									},
								],
							},
						},
						{
							type: "checkbox",
							name: "optional",
							label: "빈 값 허용",
						},
					],
				},
			],
		},
		{
			type: "group",
			name: "settings",
			label: "기타 설정",
			fields: [
				{
					type: "checkbox",
					name: "disable_previous",
					label: "이전 질문으로 돌아가기 방지",
				},
				{
					type: "checkbox",
					name: "disable_new_response",
					label: "새로운 응답 받지 않기",
				},
				{
					type: "checkbox",
					name: "require_login",
					label: "로그인 필요",
				},
			],
		},
		{
			type: "text",
			name: "url",
			label: "URL",
			hooks: {
				beforeChange: [
					({ data }) => {
						if (data?.custom_slug) {
							return `${process.env.NEXT_PUBLIC_URL}/forms/${data.custom_slug}`;
						}
						return `${process.env.NEXT_PUBLIC_URL}/forms/${data?.id ? hexToBase64URL(data.id) : crypto.randomUUID()}`;
					},
				],
				afterRead: [
					({ data }) => {
						if (data?.custom_slug) {
							return `${process.env.NEXT_PUBLIC_URL}/forms/${data.custom_slug}`;
						}
						return `${process.env.NEXT_PUBLIC_URL}/forms/${data?.id ? hexToBase64URL(data.id) : crypto.randomUUID()}`;
					},
				],
			},
			admin: {
				hidden: true,
			},
		},
	],
	admin: {
		defaultColumns: ["name", "url", "createdAt", "updatedAt"],
		useAsTitle: "name",
	},
};
