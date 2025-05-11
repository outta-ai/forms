"use client";

import { useEffect, useRef } from "react";

import { signIn } from "next-auth/react";

type Props = {
	formId: string;
};

export function LoginView({ formId }: Props) {
	const initialRef = useRef(true);

	useEffect(() => {
		if (!initialRef.current) return;
		initialRef.current = false;

		signIn("google", { callbackUrl: `/forms/${formId}` });
	}, [formId]);

	return null;
}
