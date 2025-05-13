import { createContext } from "react";

export const InputContext = createContext<{
	value: string;
	setValue: (value: string) => void;
	setValid: (valid: boolean) => void;
	optional: boolean;
}>({ value: "", setValue: () => {}, setValid: () => {}, optional: false });
