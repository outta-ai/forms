import type { PropsWithChildren } from "react";

import Providers from "./providers";

import "./styles.css";

export const metadata = {
	title: "OUTTA Forms",
	description: "OUTTA Forms",
};

export default function RootLayout(props: PropsWithChildren) {
	const { children } = props;

	return (
		<html lang="ko-KR">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
