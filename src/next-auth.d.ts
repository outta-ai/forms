import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			payload_id: string;
		} & DefaultSession["user"];
	}
}
