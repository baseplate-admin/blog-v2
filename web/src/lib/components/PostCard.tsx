import { Link } from '@inertiajs/react';
import { formatDate, readingTime } from '$lib/utils';
import Icon from '$lib/Icon';
import MoodBadge from '$lib/components/MoodBadge';
import LicenseBadge from '$lib/components/LicenseBadge';
import type { BlogPageData } from '$lib/types';

interface Props {
    post: BlogPageData;
    featured?: boolean;
}

export default function PostCard({ post, featured = false }: Props) {
    const cover = post.feed_image?.url ?? null;
    const coverAlt = post.feed_image?.alt ?? '';
    const coverAccent = post.feed_image?.dominant_color_hex ?? null;
    const date = formatDate(post.date);
    const readTime = readingTime(post.body);

    return (
        <Link href={post.url} className="group block">
            <div className="h-full rounded-2xl border border-border bg-card/60 p-6 transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5">
                {cover && (
                    <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                            src={cover}
                            alt={coverAlt}
                            loading="lazy"
                            className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        {coverAccent && (
                            <div
                                className="absolute inset-0 opacity-20 mix-blend-overlay"
                                style={{ background: `linear-gradient(to top, ${coverAccent}, transparent)` }}
                            />
                        )}
                    </div>
                )}

                <div className="mt-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <MoodBadge mood={post.mood} size="sm" />
                        <span className="inline-flex items-center gap-1 text-xs text-foreground/50">
                            <Icon name="calendar" className="size-3.5" />
                            {date}
                        </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-foreground/60">{post.intro}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-foreground/60">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-1 text-xs text-foreground/50">
                        <span className="inline-flex items-center gap-1">
                            <Icon name="clock" className="size-3.5" />
                            {readTime}
                        </span>
                        {!featured && <LicenseBadge license={post.license_type} />}
                    </div>
                </div>
            </div>
        </Link>
    );
}
