import { Link } from '@inertiajs/react';
import type { Nav, Site } from '$lib/types';

export default function Footer({ nav, site }: { nav: Nav; site: Site }) {
    const year =
        site.copyright_from && site.copyright_to
            ? `${site.copyright_from} - ${site.copyright_to}`
            : site.copyright_from
                ? String(site.copyright_from)
                : String(new Date().getFullYear());

    const license = site.license_label || 'All Rights Reserved';

    const links: Array<{ href: string | null; label: string }> = [
        { href: nav.about, label: 'About' },
        { href: nav.contact, label: 'Contact' },
        { href: nav.blog, label: 'Blog' },
        { href: nav.projects, label: 'Projects' },
    ];

    return (
        <footer className="w-full border-t border-border/50 bg-card/50 px-4 md:px-12 py-10 text-sm">
            <div className="flex flex-col md:flex-row w-full">
                <div className="flex flex-col gap-2 mb-6 md:mb-0 md:flex-row md:gap-6">
                    {links.map((item) =>
                        item.href ? (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="cursor-pointer text-foreground/60 hover:text-primary transition-colors">
                                {item.label}
                            </Link>
                        ) : null
                    )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-auto text-xs text-foreground/40">
                    <span>Copyright {year}</span>
                    <br />
                    <span>All rights reserved</span>
                    <br />
                    <span>Licensed Under: {license}</span>
                </div>
            </div>
        </footer>
    );
}
