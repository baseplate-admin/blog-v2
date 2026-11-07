/**
 * Theme state (dark/light).
 *
 * - `initTheme()` must run BEFORE the stylesheet loads to avoid a flash of
 *   the wrong theme. We call it from a small inline script in base.html.
 * - `toggleTheme()` is used by the navbar button.
 * - Theme is stored in localStorage under "theme".
 */

const STORAGE_KEY = "theme";
const VALID = ["dark", "light"] as const;
type Theme = (typeof VALID)[number];

export function getStoredTheme(): Theme {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "dark" || stored === "light") return stored;
	} catch {
		/* no-op */
	}
	return "dark";
}

export function setTheme(theme: Theme): void {
	if (theme === "dark") {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch {
		/* no-op */
	}
}

export function toggleTheme(): void {
	const current = document.documentElement.classList.contains("dark")
		? "dark"
		: "light";
	setTheme(current === "dark" ? "light" : "dark");
}

/** Runs before paint: applies the stored (or default) theme to <html>. */
export function initTheme(): void {
	setTheme(getStoredTheme());
}
