"use client";

import { useContext } from "react";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputContext } from "../_contexts/InputContext";
type Props = {
	className?: string;
};

export function EmailInput({ className }: Props) {
	const { value, setValue, setValid } = useContext(InputContext);

	return (
		<Input
			type="email"
			className={cn(className)}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onBlur={() => setValid(z.string().email().safeParse(value).success)}
		/>
	);
}
