"use client";

import { useContext } from "react";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputContext } from "../_contexts/InputContext";
type Props = {
	className?: string;
};

export function TelephoneInput({ className }: Props) {
	const { value, setValue, setValid, optional } = useContext(InputContext);

	return (
		<Input
			type="tel"
			className={cn(className)}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onBlur={() => {
				if (optional && value.trim() === "") {
					setValid(true);
					return;
				}
				setValid(
					z
						.string()
						.regex(/^\d{2,3}-\d{3,4}-\d{4}$/)
						.safeParse(value).success,
				);
			}}
		/>
	);
}
