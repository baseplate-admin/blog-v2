<svelte:options
    customElement={{
        tag: 'custom-footer',
        shadow: 'none',
        props: {
            siteName: {
                attribute: 'site-name',
                reflect: true,
                type: 'String',
            },
            copyrightStart: {
                attribute: 'copyright-start',
                reflect: true,
                type: 'String',
            },
            copyrightEnd: {
                attribute: 'copyright-end',
                reflect: true,
                type: 'String',
            },
            license: {
                attribute: 'license',
                reflect: true,
                type: 'String',
            },
            links: {
                attribute: 'links',
                reflect: true,
                type: 'String',
            },
        },
    }}
/>

<script lang="ts">
    import { normalizeProps } from '../functions/props';

    interface NavLink {
        href: string;
        label: string;
    }

    interface Props {
        siteName?: string | null;
        copyrightStart?: string | null;
        copyrightEnd?: string | null;
        license?: string | null;
        links?: string | null;
    }

    let { siteName, copyrightStart, copyrightEnd, license, links }: Props = $props();

    let navLinks = $derived.by(() => {
        if (!links) {
            return [
                { href: '/about/', label: 'About' },
                { href: '/contact/', label: 'Contact' },
                { href: '/blog/', label: 'Blog' },
            ];
        }
        try {
            return JSON.parse(links) as NavLink[];
        } catch {
            return [];
        }
    });

    let normalizedSiteName = $derived(normalizeProps(siteName));
    let normalizedLicense = $derived(normalizeProps(license));
    let startYear = $derived(normalizeProps(copyrightStart));
    let endYear = $derived(normalizeProps(copyrightEnd));

    let copyrightText = $derived.by(() => {
        const start = startYear ?? endYear ?? '';
        const end = endYear ?? '';
        const range = start && start !== end ? `${start}--${end}` : start;
        const parts: string[] = [];
        if (range) parts.push(`Copyright © ${range}`);
        if (normalizedSiteName) parts.push(`All rights reserved by ${normalizedSiteName}`);
        if (normalizedLicense) parts.push(`Licensed Under: ${normalizedLicense}`);
        return parts.join(' | ');
    });
</script>

<footer class="footer footer-center p-10 bg-base-200 text-base-content rounded-t-none border-t border-base-300 w-full z-20">
    <nav class="grid grid-flow-col gap-4 mb-4">
        {#each navLinks as link}
            <a href={link.href} class="link link-hover">{link.label}</a>
        {/each}
    </nav>

    {#if copyrightText}
        <p class="text-sm text-base-content/60">{copyrightText}</p>
    {/if}
</footer>
