"use client";

import type { PropsWithChildren } from "react";

import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (isServer) {
		return new QueryClient();
	}
	if (!browserQueryClient) {
		browserQueryClient = new QueryClient();
	}
	return browserQueryClient;
}

export default function Providers({ children }: PropsWithChildren) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>{children}</SessionProvider>
		</QueryClientProvider>
	);
}
