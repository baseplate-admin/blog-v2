import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Block } from "$lib/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Format an ISO date/datetime as e.g. "15 January 2026". */
export function formatDate(value: string | null | undefined): string {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

/** Strip HTML tags for plain-text summaries. */
export function stripHtml(html: string | null | undefined): string {
	if (!html) return "";
	return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Estimate reading time from paragraph blocks (~200 words/min). */
export function readingTime(blocks: Block[] | null | undefined): string {
	const text = (blocks ?? [])
		.map((block) => (block.type === "paragraph" ? stripHtml(block.value as string) : ""))
		.join(" ");
	const words = text.split(/\s+/).filter(Boolean).length;
	return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
