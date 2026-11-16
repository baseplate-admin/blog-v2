/** Mood / license badge metadata (labels + Tailwind color classes).
 *
 * Previously shipped from the Python serializer on every response. Now
 * resolved client-side from just the mood / license key, so the props
 * payload stays small and the map is defined once where the classes live.
 *
 * Class names are literal strings so the Tailwind scanner picks them up.
 */

export type BadgeColors = {
	bg: string;
	text: string;
	border: string;
	dot: string;
};

export type BadgeSpec = {
	label: string;
	colors: BadgeColors;
};

const MOODS: Record<string, BadgeSpec> = {
	tech: {
		label: "Technology",
		colors: {
			bg: "bg-violet-500/10",
			text: "text-violet-400 dark:text-violet-400",
			border: "border-violet-500/20",
			dot: "bg-violet-400",
		},
	},
	personal: {
		label: "Personal",
		colors: {
			bg: "bg-sky-500/10",
			text: "text-sky-400",
			border: "border-sky-500/20",
			dot: "bg-sky-400",
		},
	},
	politics: {
		label: "Politics",
		colors: {
			bg: "bg-red-500/10",
			text: "text-red-400",
			border: "border-red-500/20",
			dot: "bg-red-400",
		},
	},
	tutorial: {
		label: "Tutorial",
		colors: {
			bg: "bg-emerald-500/10",
			text: "text-emerald-400",
			border: "border-emerald-500/20",
			dot: "bg-emerald-400",
		},
	},
	opinion: {
		label: "Opinion",
		colors: {
			bg: "bg-amber-500/10",
			text: "text-amber-400",
			border: "border-amber-500/20",
			dot: "bg-amber-400",
		},
	},
	announcement: {
		label: "Announcement",
		colors: {
			bg: "bg-rose-500/10",
			text: "text-rose-400",
			border: "border-rose-500/20",
			dot: "bg-rose-400",
		},
	},
	research: {
		label: "Research",
		colors: {
			bg: "bg-indigo-500/10",
			text: "text-indigo-400",
			border: "border-indigo-500/20",
			dot: "bg-indigo-400",
		},
	},
	review: {
		label: "Review",
		colors: {
			bg: "bg-teal-500/10",
			text: "text-teal-400",
			border: "border-teal-500/20",
			dot: "bg-teal-400",
		},
	},
};

const LICENSES: Record<string, BadgeSpec> = {
	all_rights: {
		label: "All Rights Reserved",
		colors: {
			bg: "bg-red-500/10",
			text: "text-red-400",
			border: "border-red-500/20",
			dot: "bg-red-400",
		},
	},
	mit: {
		label: "MIT License",
		colors: {
			bg: "bg-green-500/10",
			text: "text-green-400",
			border: "border-green-500/20",
			dot: "bg-green-400",
		},
	},
	apache_2_0: {
		label: "Apache License 2.0",
		colors: {
			bg: "bg-blue-500/10",
			text: "text-blue-400",
			border: "border-blue-500/20",
			dot: "bg-blue-400",
		},
	},
	gpl_3: {
		label: "GNU GPL v3",
		colors: {
			bg: "bg-orange-500/10",
			text: "text-orange-400",
			border: "border-orange-500/20",
			dot: "bg-orange-400",
		},
	},
	bsd_3_clause: {
		label: "BSD 3-Clause",
		colors: {
			bg: "bg-cyan-500/10",
			text: "text-cyan-400",
			border: "border-cyan-500/20",
			dot: "bg-cyan-400",
		},
	},
	cc_by: {
		label: "CC BY 4.0",
		colors: {
			bg: "bg-yellow-500/10",
			text: "text-yellow-400",
			border: "border-yellow-500/20",
			dot: "bg-yellow-400",
		},
	},
	cc_by_sa: {
		label: "CC BY-SA 4.0",
		colors: {
			bg: "bg-purple-500/10",
			text: "text-purple-400",
			border: "border-purple-500/20",
			dot: "bg-purple-400",
		},
	},
	cc_by_nc: {
		label: "CC BY-NC 4.0",
		colors: {
			bg: "bg-pink-500/10",
			text: "text-pink-400",
			border: "border-pink-500/20",
			dot: "bg-pink-400",
		},
	},
	cc0: {
		label: "CC0 1.0",
		colors: {
			bg: "bg-teal-500/10",
			text: "text-teal-400",
			border: "border-teal-500/20",
			dot: "bg-teal-400",
		},
	},
	public_domain: {
		label: "Public Domain",
		colors: {
			bg: "bg-emerald-500/10",
			text: "text-emerald-400",
			border: "border-emerald-500/20",
			dot: "bg-emerald-400",
		},
	},
};

export function moodBadge(mood: string): BadgeSpec {
	return MOODS[mood] ?? MOODS.tech;
}

export function licenseBadge(license: string): BadgeSpec {
	return LICENSES[license] ?? LICENSES.all_rights;
}
