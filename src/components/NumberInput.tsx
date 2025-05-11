import { type ComponentProps, useEffect, useState } from "react";
import { Input } from "./ui/input";

type Props = {
	value: number | undefined;
	onChange: (value: number) => void;
} & Omit<ComponentProps<typeof Input>, "onChange" | "value">;

export function NumberInput({ value, onChange, ...props }: Props) {
	const [buffer, setBuffer] = useState(
		Number.isNaN(value) ? "" : value?.toString() || "",
	);

	useEffect(() => {
		setBuffer(value?.toString() || "");
	}, [value]);

	return (
		<Input
			{...props}
			value={buffer}
			onChange={(e) => setBuffer(e.target.value)}
			onBlur={() => onChange(Number(buffer))}
		/>
	);
}
