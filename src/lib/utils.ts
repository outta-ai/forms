import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function hexToBase64URL(hexString: string) {
	const bytes = new Uint8Array(
		hexString.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? [],
	);
	return btoa(String.fromCharCode.apply(null, Array.from(bytes)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

export function base64URLToHex(base64URL: string) {
	// Base64URL을 일반 Base64로 변환
	const base64 =
		base64URL.replace(/-/g, "+").replace(/_/g, "/") +
		"=".repeat((4 - (base64URL.length % 4)) % 4);

	// Base64를 바이트 배열로 변환
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	// 바이트 배열을 16진수 문자열로 변환
	return Array.from(bytes)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}
