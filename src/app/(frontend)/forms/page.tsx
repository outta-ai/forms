import { TriangleAlert } from "lucide-react";

export default async function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center h-full ">
			<TriangleAlert className="w-12 h-12 text-muted-foreground" />
			<p className="text-muted-foreground mt-3">정상적인 접근이 아닙니다</p>
		</div>
	);
}
