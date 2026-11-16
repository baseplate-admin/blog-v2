import { Link, usePage, router } from '@inertiajs/react';
import Icon from '$lib/Icon';
import MoodBadge from '$lib/components/MoodBadge';
import { readingTime } from '$lib/utils';
import { moodBadge } from '$lib/badges';
import { cn } from '$lib/utils';
import type { BlogPageData, MoodChoice, Nav, Paginator, TagCount } from '$lib/types';

interface Props {
    intro?: string;
    about?: string;
    blogpages?: Paginator<BlogPageData>;
    tag_cloud?: TagCount[];
    mood_choices?: MoodChoice[];
    request_tag?: string | null;
    request_mood?: string | null;
    nav: Nav;
}

export default function BlogIndex({
    intro = '',
    blogpages,
    tag_cloud = [],
    mood_choices = [],
    request_tag = null,
    request_mood = null,
    nav,
}: Props) {
    const posts = blogpages?.items ?? [];
    const total = blogpages?.count ?? posts.length;

    const pageUrl = usePage().url;
    const pageTitle = (usePage().props as { title?: string }).title ?? 'Blog';

    function filter(query: { tag?: string | null; mood?: string | null }) {
        const params = new URLSearchParams();
        if (query.tag) params.set('tag', query.tag);
        if (query.mood) params.set('mood', query.mood);
        const url = pageUrl + (params.toString() ? '?' + params.toString() : '');
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    }

    const loadMore = () => {
        if (!blogpages?.has_next) return;
        const params = new URLSearchParams();
        params.set('page', String(blogpages.number + 1));
        if (request_tag) params.set('tag', request_tag);
        if (request_mood) params.set('mood', request_mood);
        router.get(pageUrl + '?' + params.toString(), {}, { preserveScroll: true, preserveState: true });
    };

    // Build the filter pills from mood_choices + tags
    const allMoods: MoodChoice[] = mood_choices;

    return (
        <div className="relative flex-1">
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="w-full border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        {pageTitle}
                    </h1>
                    {intro && (
                        <p className="mt-4 text-lg text-foreground/60 max-w-2xl leading-relaxed">
                            {intro}
                        </p>
                    )}

                    {/* Filter pills */}
                    {(allMoods.length > 0 || tag_cloud.length > 0) && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {/* "All" pill */}
                            <button
                                onClick={() => filter({ tag: null, mood: null })}
                                className={cn(
                                    'inline-flex items-center h-8 rounded-full px-4 text-sm font-medium transition-colors',
                                    !request_tag && !request_mood
                                        ? 'bg-foreground text-background'
                                        : 'border border-border text-foreground/70 hover:bg-muted hover:text-foreground'
                                )}
                            >
                                All
                            </button>

                            {/* Mood pills */}
                            {allMoods.map(([value, label]) => {
                                const badge = moodBadge(value);
                                const isActive = request_mood === value;
                                return (
                                    <button
                                        key={value}
                                        onClick={() => filter({ tag: request_tag, mood: isActive ? null : value })}
                                        className={cn(
                                            'inline-flex items-center gap-1.5 h-8 rounded-full px-4 text-sm font-medium transition-colors',
                                            isActive
                                                ? badge.colors.bg + ' ' + badge.colors.text + ' ' + badge.colors.border + ' border'
                                                : 'border border-border text-foreground/70 hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <span className={cn('size-1.5 rounded-full', badge.colors.dot)} />
                                        {label}
                                    </button>
                                );
                            })}

                            {/* Tag pills */}
                            {tag_cloud.map(({ tag__name, count }) => {
                                const isActive = request_tag === tag__name;
                                return (
                                    <button
                                        key={tag__name}
                                        onClick={() => filter({ tag: isActive ? null : tag__name, mood: request_mood })}
                                        className={cn(
                                            'inline-flex items-center h-8 rounded-full px-4 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-foreground text-background'
                                                : 'border border-border text-foreground/60 hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        #{tag__name}
                                        <span className="ml-1.5 text-xs text-foreground/50">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Post Grid ──────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Link
                                key={post.url}
                                href={post.url}
                                className="group relative flex flex-col rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:border-foreground/20 hover:bg-card/60 hover:shadow-lg"
                            >
                                {/* Top row: mood + date */}
                                <div className="flex items-center justify-between mb-4">
                                    <MoodBadge mood={post.mood} size="sm" />
                                    <time dateTime={post.date} className="text-xs text-foreground/55 font-mono">
                                        {post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                    </time>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>

                                {/* Description */}
                                {post.intro && (
                                    <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-3">
                                        {post.intro}
                                    </p>
                                )}

                                {/* Bottom: read time + tags */}
                                <div className="mt-auto pt-6 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground/55 font-mono">
                                        <Icon name="clock" size={12} />
                                        {readingTime(post.body)}
                                    </span>
                                    {post.tags.length > 0 && (
                                        <div className="flex gap-1.5">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="text-xs text-foreground/50">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                            <Icon name="search" size={28} className="text-foreground/30" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No Posts Found</h2>
                        <p className="text-foreground/50">Try adjusting your search or filter.</p>
                    </div>
                )}

                {/* Load more */}
                {blogpages?.has_next && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={loadMore}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-6 font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                        >
                            <span className="size-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
                            Load more
                        </button>
                    </div>
                )}

                {/* Post count */}
                <div className="mt-12 text-center text-xs text-foreground/30 font-mono">
                    {total} post{total !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}
