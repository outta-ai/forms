import type { CollectionConfig } from "payload";

export const Option: CollectionConfig = {
	slug: "option",
	fields: [
		{
			type: "text",
			name: "label",
			required: true,
			unique: true,
		},
		{
			type: "array",
			name: "options",
			fields: [
				{
					type: "text",
					name: "label",
					required: true,
				},
			],
			required: true,
		},
	],
	admin: {
		useAsTitle: "label",
	},
};
