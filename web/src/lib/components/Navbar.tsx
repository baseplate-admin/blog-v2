import { useEffect, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { toggleTheme, isDark } from '$lib/hooks/theme';
import Icon from '$lib/Icon';
import { cn } from '$lib/utils';
import type { Nav } from '$lib/types';

export default function Navbar({ nav }: { nav: Nav }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Re-read theme after each toggle so the icon tracks the <html> .dark class.
    const [dark, setDark] = useState<boolean>(() => isDark());
    const toggle = () => {
        toggleTheme();
        setDark(isDark());
    };

    const url = usePage().url;

    const links: Array<{ href: string | null; label: string }> = [
        { href: nav.about, label: 'About' },
        { href: nav.blog, label: 'Blog' },
        { href: nav.projects, label: 'Projects' },
        { href: nav.contact, label: 'Contact' },
    ];

    // Global Ctrl/Cmd+K opens the search modal.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                void router.get('/search/');
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Close the mobile menu when navigating or clicking outside.
    useEffect(() => {
        if (!mobileOpen) return;
        const close = () => setMobileOpen(false);
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [mobileOpen]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
            <nav className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary"
                >
                    The Tinkerer
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {links.map((item) =>
                        item.href ? (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors',
                                    url === item.href
                                        ? 'text-foreground'
                                        : 'text-foreground/60 hover:text-foreground',
                                )}
                            >
                                {item.label}
                            </Link>
                        ) : null,
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        id="theme-toggle"
                        className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                        onClick={toggle}
                        aria-label="Toggle theme"
                    >
                        <Icon
                            name={dark ? 'moon' : 'sun'}
                            size={18}
                        />
                    </button>

                    <button
                        id="mobile-menu-btn"
                        className="flex size-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted md:hidden"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMobileOpen((o) => !o);
                        }}
                        aria-label="Toggle menu"
                    >
                        <Icon name={mobileOpen ? 'x' : 'menu'} size={20} />
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="border-t border-border md:hidden">
                    <div className="px-4 py-3">
                        {links.map((item) =>
                            item.href ? (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            ) : null,
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
