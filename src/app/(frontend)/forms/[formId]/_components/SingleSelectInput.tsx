"use client";

import { useContext } from "react";

import type { Option } from "@/payload-types";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { skipToken, useQuery } from "@tanstack/react-query";
import ky from "ky";
import { InputContext } from "../_contexts/InputContext";

type Props = {
	className?: string;
	option?: Option | string | null;
};

export function SingleSelectInput({ className, option }: Props) {
	const { value, setValue, setValid } = useContext(InputContext);

	const { data: options } = useQuery({
		queryKey: ["option", typeof option === "string" ? option : option?.id],
		queryFn: option
			? async () => {
					if (typeof option !== "string") {
						return option;
					}
					const res = await ky.get<Option>(`/api/options/${option}`);
					return res.json();
				}
			: skipToken,
	});

	if (!option) {
		return (
			<p className="text-red-600">
				Form 데이터가 잘못 구성되어 있습니다. 관리자에게 연락해 주세요
			</p>
		);
	}

	return (
		<RadioGroup
			value={value}
			onValueChange={(e) => {
				setValue(e);
				setValid(true);
			}}
			className={cn("flex flex-col lg:flex-row lg:gap-3", className)}
		>
			{options?.options.map((option) => (
				<div key={option.id} className="mt-3 flex">
					<RadioGroupItem
						id={option.id ?? ""}
						value={option.id ?? ""}
						className="mr-1 cursor-pointer"
					/>
					<Label htmlFor={option.id ?? ""} className="cursor-pointer">
						{option.label}
					</Label>
				</div>
			))}
		</RadioGroup>
	);
}
