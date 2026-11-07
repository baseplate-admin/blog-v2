<script lang="ts">
	import { type HTMLAttributes } from "svelte/elements";
	import { type VariantProps, cva } from "class-variance-authority";
	import { cn } from "$lib/utils";

	const badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				destructive: "border-transparent bg-destructive text-destructive-foreground",
				outline: "text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	let {
		variant = "default",
		class: className = "",
		...rest
	}: {
		variant?: NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
	} & HTMLAttributes<HTMLSpanElement> = $props();
</script>

<span {...rest} class={cn(badgeVariants({ variant }), className)}></span>
