/**
 * Theme state (dark/light) using shadcn's `.dark` class on <html>.
 *
 * - Default is dark (matches base.html initial `<html class="dark">`).
 * - `toggleTheme()` flips the `dark` class on <html>.
 * - Theme is stored in localStorage under "theme".
 */

const STORAGE_KEY = "theme";

export function getStoredTheme(): "dark" | "light" {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "dark" || stored === "light") {
			return stored;
		}
	} catch {
		/* no-op */
	}
	return "dark";
}

export function setTheme(theme: "dark" | "light"): void {
	document.documentElement.classList.toggle("dark", theme === "dark");
	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch {
		/* no-op */
	}
}

export function toggleTheme(): void {
	setTheme(isDark() ? "light" : "dark");
}

export function isDark(): boolean {
	return document.documentElement.classList.contains("dark");
}

/** Runs before paint: applies the stored (or default) theme to <html>. */
export function initTheme(): void {
	setTheme(getStoredTheme());
}
