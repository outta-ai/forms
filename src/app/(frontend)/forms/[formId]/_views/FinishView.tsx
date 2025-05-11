"use client";

import { useEffect } from "react";

import type { Form, Response } from "@/payload-types";

import ky from "ky";
import { Check } from "lucide-react";

type Props = {
	form: Form;
	responseId: string;
};

export function FinishView({ form, responseId }: Props) {
	useEffect(() => {
		(async () => {
			await ky.patch(`/api/response/${responseId}`, {
				json: {
					finished: true,
				} satisfies Partial<Response>,
			});
		})();
	}, [responseId]);

	return (
		<div className="flex flex-col items-center justify-center h-full">
			<Check className="w-12 h-12 text-muted-foreground" />
			<p className="text-muted-foreground mt-3">
				모든 질문에 답변하셨습니다. 감사합니다.
			</p>
		</div>
	);
}
