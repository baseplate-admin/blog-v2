<script lang="ts">
    /**
     * Renders a Twemoji as an inline SVG, sourced from
     * `web/src/vendor/twemoji/svg/`.
     *
     * The full SVG set is imported eagerly into the main bundle (one large
     * `main.js` by design) and inlined into the DOM via `@html`, so you can
     * control it with CSS (width/height, `filter`, `clip-path`, opacity, …).
     * Tailwind classes on the component apply to the `<svg>` element itself.
     *
     * ```svelte
     * <Emoji value="✨" class="inline h-5 w-5 align-[-0.125em]" />
     * <Emoji codepoint="1f600" class="h-8 w-8" />
     * ```
     *
     * Twemoji graphics are CC-BY 4.0; credit "Twemoji (CC-BY 4.0)" somewhere
     * visible (e.g. the footer).
     *
     * Note: the SVGs ship with hardcoded `fill` colors, so `text-*` /
     * `currentColor` will not recolor them. Use `filter` or `clip-path` if
     * you need to adapt them to your theme.
     */
    import twemoji from 'twemoji';

    // Eager glob: every SVG is bundled into main.js, so no per-emoji chunks
    // or network requests are needed at render time.
    const TWEMOJI = import.meta.glob<string>('../vendor/twemoji/svg/*.svg', {
        query: '?raw',
        import: 'default',
    });

    let {
        value,
        codepoint,
        class: className = 'inline h-[1.2em] w-[1.2em] align-[-0.15em]',
        ...rest
    }: {
        /** Emoji character, e.g. "✨". Ignored if `codepoint` is set. */
        value?: string;
        /** Hex codepoint string, e.g. "1f600" or "1f1e8-1f1f3". */
        codepoint?: string;
        class?: string;
    } & Record<string, unknown> = $props();

    /** Resolve to a lowercase hex codepoint string, or '' if neither given. */
    const cp = $derived(
        codepoint ??
            (value ? twemoji.convert.toCodePoint(value).toLowerCase() : ''),
    );

    let svgHtml: string = $state('');
    let failed = $state(false);

    $effect(() => {
        const key = cp ? `../vendor/twemoji/svg/${cp}.svg` : '';
        const loader = key ? TWEMOJI[key] : undefined;

        svgHtml = '';
        failed = !!key && !loader;

        if (loader) {
            let cancelled = false;

            loader()
                .then((svg) => {
                    if (!cancelled) {
                        svgHtml = svg.trim();
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        failed = true;
                    }
                });

            return () => {
                cancelled = true;
            };
        }
    });
</script>

{#if svgHtml}
    {@html svgHtml}
{:else if failed}
    <span aria-hidden="true" class={className}>?</span>
{:else}
    <span aria-hidden="true" class={className}></span>
{/if}
