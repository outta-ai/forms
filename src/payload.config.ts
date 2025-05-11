import path from "node:path";
import { fileURLToPath } from "node:url";

// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

import sharp from "sharp";

import { Admin } from "./collections/Admin";
import { Form } from "./collections/Form";
import { Response } from "./collections/Response";
import { User } from "./collections/User";
import { Option } from "./collections/Option";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Admin.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [Admin, User, Form, Response, Option],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || "",
	}),
	sharp,
	plugins: [
		payloadCloudPlugin(),
		// storage-adapter-placeholder
	],
});
