"use client";

import { useContext } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { InputContext } from "../_contexts/InputContext";
type Props = {
	className?: string;
};

export function TextareaInput({ className }: Props) {
	const { value, setValue, setValid, optional } = useContext(InputContext);

	return (
		<Textarea
			className={cn(className)}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onBlur={() => setValid(optional || value.length > 0)}
		/>
	);
}
