import type { CollectionConfig } from "payload";

export const User: CollectionConfig = {
	slug: "user",
	fields: [
		{
			name: "name",
			type: "text",
		},
		{
			name: "email",
			type: "email",
		},
		{
			name: "type",
			type: "text",
		},
		{
			name: "data",
			type: "json",
		},
		{
			name: "label",
			type: "text",
			hidden: true,
			hooks: {
				afterRead: [
					({ data }) =>
						`${data?.name || "이름 없음"} (${data?.email || "이메일 없음"})`,
				],
				beforeChange: [
					({ siblingData: data }) =>
						`${data.name || "이름 없음"} (${data.email})`,
				],
			},
		},
	],
	admin: {
		useAsTitle: "label",
	},
};
