import { router } from '@inertiajs/react';
import Icon from '$lib/Icon';
import AOS from '$lib/blocks/AOS';
import type { Nav } from '$lib/types';

export default function NotFound({ nav }: { nav: Nav }) {
    return (
        <div className="relative overflow-hidden bg-glow-center bg-glow-accent">
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-16 left-1/4 w-2 h-2 rounded-full bg-primary/20"></div>
                <div className="absolute top-32 right-1/4 w-1.5 h-1.5 rounded-full bg-secondary/15"></div>
                <div className="absolute bottom-20 left-1/3 w-1 h-1 rounded-full bg-accent/10"></div>
            </div>
            <section className="max-w-7xl mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-px bg-linear-to-r from-transparent to-primary/30"></div>
                    <div className="w-2 h-2 rounded-full bg-primary/25"></div>
                    <div className="w-12 h-px bg-linear-to-l from-transparent to-primary/30"></div>
                </div>
                <AOS animation="fade-up">
                    <p className="font-mono text-7xl md:text-8xl font-bold tracking-tight">
                        <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                            404
                        </span>
                    </p>
                </AOS>
                <AOS animation="fade-up" delay={100}>
                    <h1 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                        Page not found
                    </h1>
                </AOS>
                <AOS animation="fade-up" delay={200}>
                    <p className="mt-3 text-foreground/60">
                        The page you're looking for doesn't exist or was moved.
                    </p>
                </AOS>
                <AOS animation="fade-up" delay={300}>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={() => router.get('/')}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Icon name="arrow-left" size={16} />
                            Back home
                        </button>
                        {nav.blog && (
                            <button
                                onClick={() => router.get(nav.blog ?? '/blog/')}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                <Icon name="book-open" size={16} />
                                Browse the blog
                            </button>
                        )}
                    </div>
                </AOS>
            </section>
        </div>
    );
}
