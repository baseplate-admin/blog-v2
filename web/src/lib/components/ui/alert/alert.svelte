<script lang="ts">
	import { type HTMLAttributes } from "svelte/elements";
	import { type Snippet } from "svelte";
	import { type VariantProps, cva } from "class-variance-authority";
	import { cn } from "$lib/utils";

	const alertVariants = cva("relative w-full rounded-lg border p-4 text-sm has-[>svg]:pl-11", {
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive:
					"text-destructive bg-destructive/10 dark:text-destructive [&>svg]:text-current [&_svg]:text-current",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	let {
		variant = "default",
		children,
		class: className = "",
		...rest
	}: {
		variant?: NonNullable<VariantProps<typeof alertVariants>["variant"]>;
		children?: Snippet;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	role="alert"
	{...rest}
	class={cn(alertVariants({ variant }), className)}>
	{@render children?.()}
</div>
