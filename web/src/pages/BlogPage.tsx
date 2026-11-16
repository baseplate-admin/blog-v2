import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import Icon from '$lib/Icon';
import MoodBadge from '$lib/components/MoodBadge';
import LicenseBadge from '$lib/components/LicenseBadge';
import Toc from '$lib/components/Toc';
import TocMobile from '$lib/components/TocMobile';
import BlockRenderer from '$lib/blocks/BlockRenderer';
import { formatDate, readingTime } from '$lib/utils';
import type {
    ImageValue,
    Nav,
    StreamBlock,
    TocItem,
    UserRef,
} from '$lib/types';

interface Props {
    title: string;
    intro: string;
    mood: string;
    date: string;
    tags?: string[];
    license_type: string;
    feed_image: ImageValue | null;
    owner: UserRef | null;
    first_published_at: string | null;
    last_published_at: string | null;
    body?: StreamBlock[];
    url: string;
    nav: Nav;
}

const PROSE = `prose prose-lg prose-invert max-w-none
    prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground
    prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-4 prose-h2:scroll-mt-24
    prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3 prose-h3:scroll-mt-24
    prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/85
    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
    prose-strong:text-foreground prose-strong:font-semibold
    prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-border/50 prose-code:text-foreground/90
    prose-pre:text-foreground/90 prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:p-4
    prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-border/50
    prose-blockquote:border-l-2 prose-blockquote:border-primary/50 prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-foreground/80
    prose-li:text-foreground/85 prose-li:marker:text-foreground/50
    prose-hr:border-border/50 prose-hr:my-12
    prose-table:text-foreground/85 prose-th:text-foreground prose-th:bg-muted prose-td:text-foreground/85
    prose-tr:border-border/50 prose-th:border-border/50 prose-td:border-border/50`;

export default function BlogPage({
    title,
    intro,
    mood,
    date,
    tags = [],
    license_type,
    feed_image,
    owner,
    first_published_at,
    last_published_at,
    body = [],
    nav,
}: Props) {
    const [progress, setProgress] = useState(0);

    const cover = feed_image?.url ?? null;
    const coverAlt = feed_image?.alt ?? '';
    const authorAvatar = owner ? `/avatar/${owner.id}/` : null;
    const formattedDate = formatDate(date);
    const readTime = readingTime(body);
    const showUpdated =
        !!first_published_at &&
        !!last_published_at &&
        first_published_at.slice(0, 10) !== last_published_at.slice(0, 10);
    const updatedDate = showUpdated ? formatDate(last_published_at) : null;
    const toc: TocItem[] = body.flatMap((block, i) => {
        if (
            block.type === 'aos_heading' &&
            (block.value.level === 'h2' || block.value.level === 'h3')
        ) {
            return [
                {
                    id: `heading-${i}`,
                    text: block.value.text,
                    level: block.value.level,
                },
            ];
        }
        return [];
    });

    function updateProgress() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0);
    }

    useEffect(() => {
        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="relative flex-1">
            {/* Reading progress bar */}
            <div className="fixed inset-x-0 top-0 z-50 h-0.5">
                <div
                    className="h-full bg-linear-to-r from-primary to-accent transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-10 lg:gap-16 items-stretch">
                    {/* ── Article ─────────────────────────────────────────── */}
                    <article className="relative w-full min-w-0 max-w-3xl">
                        {/* Breadcrumb */}
                        <nav
                            className="mb-8 flex items-center gap-2 text-sm text-foreground/55"
                            aria-label="Breadcrumb"
                        >
                            <Link
                                href={nav.blog ?? '/blog/'}
                                className="hover:text-foreground transition-colors"
                            >
                                Blog
                            </Link>
                            <span className="text-foreground/20">/</span>
                            <MoodBadge mood={mood} size="sm" />
                        </nav>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15] text-balance">
                            {title}
                        </h1>

                        {/* Meta row: author left, date + read time right */}
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full ring-1 ring-border overflow-hidden bg-muted">
                                    {authorAvatar ? (
                                        <img
                                            src={authorAvatar}
                                            alt={owner?.username ?? 'Author'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon
                                                name="crown"
                                                size={16}
                                                className="text-foreground/40"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-medium text-foreground">
                                        {owner?.username ?? 'Author'}
                                    </span>
                                    <span className="text-xs text-foreground/60">
                                        Author
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-foreground/65 font-mono">
                                <time
                                    dateTime={date}
                                    className="inline-flex items-center gap-1.5"
                                >
                                    <Icon
                                        name="calendar"
                                        size={14}
                                        className="text-foreground/40"
                                    />
                                    {formattedDate}
                                </time>
                                {showUpdated && updatedDate && (
                                    <span className="hidden sm:inline-flex items-center gap-1.5 text-foreground/55">
                                        <Icon name="history" size={13} />
                                        {updatedDate}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5">
                                    <Icon
                                        name="clock"
                                        size={14}
                                        className="text-foreground/40"
                                    />
                                    {readTime}
                                </span>
                            </div>
                        </div>

                        {/* Cover image */}
                        {cover && (
                            <figure className="mt-10 w-full aspect-video overflow-hidden rounded-2xl border border-border bg-card">
                                <img
                                    src={cover}
                                    alt={coverAlt}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                            </figure>
                        )}

                        {/* Intro */}
                        {intro && (
                            <p className="mt-8 text-xl text-foreground/80 leading-relaxed font-normal">
                                {intro}
                            </p>
                        )}

                        {/* Divider before body */}
                        <div className="mt-10 h-px w-full bg-linear-to-r from-border via-border to-transparent" />

                        {/* Mobile TOC (desktop TOC is the sticky sidebar) */}
                        <TocMobile toc={toc} />

                        {/* Article body */}
                        <div id="article-content" className={'mt-8 ' + PROSE}>
                            {body.map((block, i) => (
                                <BlockRenderer
                                    key={i}
                                    block={block}
                                    id={
                                        block.type === 'aos_heading'
                                            ? `heading-${i}`
                                            : undefined
                                    }
                                />
                            ))}
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="mt-14 flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`${nav.blog ?? '/blog/'}?tag=${encodeURIComponent(tag)}`}
                                        className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm text-foreground/75 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* End of article */}
                        <div className="mt-16 pt-8 border-t border-border/50">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-foreground/60 font-mono uppercase tracking-wider">
                                        Licensed Under
                                    </span>
                                    <LicenseBadge license={license_type} />
                                </div>
                                <Link
                                    href={nav.blog ?? '/blog/'}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                                >
                                    <Icon name="arrow-left" size={14} />
                                    Back to blog
                                </Link>
                            </div>
                        </div>
                    </article>

                    {/* ── TOC sidebar ─────────────────────────────────────── */}
                    {/* The aside must stretch to the full grid row height (matching
                        the article column) so the inner sticky div has room to
                        travel. `self-start` would shrink it to its content height,
                        giving sticky no range. */}
                    <aside
                        className="hidden lg:block"
                        id="toc-wrapper"
                    >
                        <div className="sticky top-24">
                            <Toc toc={toc} />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
