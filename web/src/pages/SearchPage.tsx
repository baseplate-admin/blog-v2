import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import Icon from '$lib/Icon';
import MoodBadge from '$lib/components/MoodBadge';
import type { Nav } from '$lib/types';
import { cn } from '$lib/utils';

interface Post {
    url: string;
    title: string;
    intro: string;
    mood: string;
    date: string;
}

interface Props {
    posts?: Post[];
    nav: Nav;
}

export default function SearchPage({ posts = [], nav }: Props) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Client-side instant filter over the preloaded post list (no round-trips).
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return posts;
        return posts.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.intro.toLowerCase().includes(q),
        );
    }, [query, posts]);

    const go = (url: string) => {
        void router.get(url);
    };

    const close = () => {
        history.back();
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const onKey = (e: React.KeyboardEvent) => {
        const n = filtered.length;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (n) setActiveIndex((i) => (i + 1) % n);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (n) setActiveIndex((i) => (i - 1 + n) % n);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const target = filtered[activeIndex] ?? filtered[0];
            if (target) go(target.url);
        } else if (e.key === 'Escape') {
            close();
        }
    };

    return (
        <>
            {/* backdrop */}
            <button
                className="fixed inset-0 z-40 cursor-default bg-background/60 backdrop-blur-sm"
                aria-label="Close search"
                onClick={close}
                tabIndex={-1}
            />

            {/* panel */}
            <div className="fixed left-1/2 top-24 z-50 flex max-h-[70svh] w-full max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:top-28">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <span className="text-foreground/50 shrink-0">
                        <Icon name="search" />
                    </span>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        type="search"
                        placeholder="Search articles..."
                        className="flex-1 bg-transparent text-base focus:outline-none"
                        autoComplete="off"
                        onKeyDown={onKey}
                    />
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-card rounded border border-border hidden sm:inline-flex">
                        ESC
                    </kbd>
                    <button onClick={close} className="cursor-pointer text-xs font-medium text-foreground/60 hover:text-foreground transition-colors">
                        Close
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
                    {filtered.length > 0 ? (
                        <ul className="flex flex-col gap-1">
                            {filtered.map((post, i) => (
                                <li key={post.url}>
                                    <button
                                        className={cn(
                                            'w-full rounded-lg px-3 py-2.5 text-left transition-colors',
                                            i === activeIndex
                                                ? 'bg-card'
                                                : 'hover:bg-card/60',
                                        )}
                                        onClick={() => go(post.url)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <MoodBadge
                                                mood={post.mood}
                                                size="sm"
                                            />
                                            <span className="truncate text-sm font-medium text-foreground">
                                                {post.title}
                                            </span>
                                        </div>
                                        {post.intro && (
                                            <p className="ml-0 mt-1 line-clamp-2 text-xs text-foreground/60">
                                                {post.intro}
                                            </p>
                                        )}
                                        <p className="mt-1 font-mono text-[10px] text-foreground/40">
                                            {post.date}
                                        </p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-6 text-center text-xs text-foreground/30 font-mono">
                            {query
                                ? `No results for "${query}"`
                                : 'Start typing to search...'}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
