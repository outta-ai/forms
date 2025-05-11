import { getServerSession, type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import config from "@payload-config";
import { getPayload } from "payload";

export const authConfig = {
	providers: [
		GoogleProvider({
			// biome-ignore lint/style/noNonNullAssertion: Google Client ID is required
			clientId: process.env.GOOGLE_CLIENT_ID!,
			// biome-ignore lint/style/noNonNullAssertion: Google Client Secret is required
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		signIn: async (user) => {
			const payload = await getPayload({ config });

			const email = user.profile?.email;
			if (!email) {
				return false;
			}

			const payloadUser = await payload.find({
				collection: "user",
				where: {
					email: { equals: email },
				},
			});

			if (payloadUser.totalDocs === 0) {
				await payload.create({
					collection: "user",
					data: {
						name: user.profile?.name || email,
						email,
						type: "google",
						data: {
							...user,
							account: {
								...user.account,
								access_token: "<REDACTED>",
								refresh_token: "<REDACTED>",
								id_token: "<REDACTED>",
							},
						},
					},
				});
			}

			return true;
		},
		session: async ({ session, user }) => {
			const email = session.user?.email || user?.email;
			if (!email) {
				return session;
			}

			const payload = await getPayload({ config });

			const payloadUser = await payload.find({
				collection: "user",
				where: {
					email: { equals: email },
				},
			});

			if (payloadUser.totalDocs === 0) {
				return session;
			}

			session.user.payload_id = payloadUser.docs[0].id;
			return session;
		},
	},
} satisfies AuthOptions;

export const getSession = () => getServerSession(authConfig);
