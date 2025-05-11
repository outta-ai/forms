import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

type Props = {
	errorId: "not_found" | "multiple_forms" | "no_sections" | "no_questions";
};

export function ErrorView({ errorId }: Props) {
	if (errorId === "not_found") {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<TriangleAlert className="w-12 h-12 text-muted-foreground" />
				<p className="text-muted-foreground mt-3">정상적인 접근이 아닙니다</p>
			</div>
		);
	}

	if (errorId === "no_sections" || errorId === "no_questions") {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<TriangleAlert className="w-12 h-12 text-muted-foreground" />
				<p className="text-muted-foreground mt-3">
					Form 데이터가 올바르게 설정되지 않았습니다
				</p>
				<Button type="button" asChild>
					<Link href="/admin">관리자 페이지로</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center h-full">
			<TriangleAlert className="w-12 h-12 text-muted-foreground" />
			<p className="text-muted-foreground mt-3">
				동일한 ID의 폼이 여러 개 존재합니다
			</p>
			<Button type="button" asChild>
				<Link href="/admin">관리자 페이지로</Link>
			</Button>
		</div>
	);
}
