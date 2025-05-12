import type { CollectionConfig } from "payload";

export const Response: CollectionConfig = {
	slug: "response",
	access: {
		read: () => true,
		create: () => true,
		update: () => true,
	},
	fields: [
		{
			type: "relationship",
			name: "form",
			relationTo: "form",
			required: true,
		},
		{
			type: "relationship",
			name: "user",
			relationTo: "user",
		},
		{
			type: "array",
			name: "data",
			label: "응답 데이터",
			fields: [
				{
					type: "text",
					name: "question",
					label: "질문 ID",
					required: true,
				},
				{
					type: "text",
					name: "answer",
					label: "응답",
				},
				{
					type: "date",
					name: "shownAt",
					label: "표시된 시간",
					admin: {
						date: {
							displayFormat: "YYYY-MM-DD HH:mm:ss",
						},
					},
				},
				{
					type: "date",
					name: "submittedAt",
					label: "제출된 시간",
					admin: {
						date: {
							displayFormat: "YYYY-MM-DD HH:mm:ss",
						},
					},
				},
			],
		},
		{
			type: "checkbox",
			name: "finished",
			label: "응답 완료",
		},
	],
};
