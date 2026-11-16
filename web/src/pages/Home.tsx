import { Link } from '@inertiajs/react';
import Icon from '$lib/Icon';
import AOS from '$lib/blocks/AOS';
import BlockRenderer from '$lib/blocks/BlockRenderer';
import type {
    Block,
    BlogPageData,
    ProjectPageData,
    StreamBlock,
    Nav,
} from '$lib/types';

interface Props {
    hero_title: string;
    hero_subtitle?: string;
    hero_ctas?: Block<{ text: string; url: string }>[];
    latest_posts?: BlogPageData[];
    featured_projects?: ProjectPageData[];
    body?: StreamBlock[];
    nav: Nav;
}

/** Dotwork corner accents (4 small dots at the card corners). */
function Corners({ color = 'bg-primary/20' }: { color?: string }) {
    return (
        <>
            <div
                className={`absolute top-2 left-2 w-1.5 h-1.5 rounded-full ${color}`}
            />
            <div
                className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${color}`}
            />
            <div
                className={`absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full ${color}`}
            />
            <div
                className={`absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full ${color}`}
            />
        </>
    );
}

export default function Home({
    hero_title,
    hero_subtitle = '',
    hero_ctas = [],
    latest_posts = [],
    featured_projects = [],
    body = [],
    nav,
}: Props) {
    const ctas = hero_ctas.map((cta) => cta.value);

    return (
        <>
            {/* ── Hero Section ─────────────────────────────────────── */}
            <div className="relative w-full border-b border-border overflow-hidden bg-glow-center bg-glow-accent border-glow-bottom">
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-primary/20"></div>
                    <div className="absolute top-20 left-32 w-1.5 h-1.5 rounded-full bg-primary/15"></div>
                    <div className="absolute top-16 left-24 w-1 h-1 rounded-full bg-primary/10"></div>
                    <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-secondary/20"></div>
                    <div className="absolute top-56 right-48 w-1.5 h-1.5 rounded-full bg-secondary/15"></div>
                    <div className="absolute top-48 right-36 w-1 h-1 rounded-full bg-secondary/10"></div>
                    <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-accent/15"></div>
                    <div className="absolute bottom-32 left-1/3 w-1 h-1 rounded-full bg-accent/10"></div>
                    <div className="absolute bottom-16 right-1/4 w-1.5 h-1.5 rounded-full bg-primary/15"></div>
                    <div className="absolute top-1/3 left-1/6 w-1 h-1 rounded-full bg-primary/10"></div>
                    <div className="absolute top-2/3 right-1/6 w-1 h-1 rounded-full bg-secondary/10"></div>
                    <div className="absolute top-10 left-10 w-24 h-px bg-primary/5 transform rotate-12"></div>
                    <div className="absolute top-40 right-20 w-28 h-px bg-secondary/5 transform -rotate-12"></div>
                    <div className="absolute bottom-20 left-1/4 w-20 h-px bg-accent/5 transform rotate-6"></div>
                </div>
                <div className="relative z-10 min-h-[70vh] bg-background/50">
                    <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                        <div className="max-w-2xl">
                            <div className="flex justify-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-px bg-linear-to-r from-transparent to-primary/30"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-primary/25"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                                    <div className="w-12 h-px bg-linear-to-l from-transparent to-primary/30"></div>
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                                {hero_title}
                            </h1>
                            {hero_subtitle && (
                                <div
                                    className="py-6 text-xl md:text-2xl text-foreground/80 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: hero_subtitle,
                                    }}
                                />
                            )}
                            <div className="flex gap-4 justify-center mt-4">
                                {ctas.slice(0, 2).map((cta, i) => (
                                    <a
                                        key={cta.url}
                                        href={cta.url}
                                        className={
                                            i === 0
                                                ? 'inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-medium text-primary-foreground shadow-lg hover:shadow-primary/20 hover:bg-primary/90 transition-all'
                                                : 'inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 font-medium text-foreground hover:bg-muted transition-all'
                                        }
                                    >
                                        {cta.text}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-50"></div>
            </div>

            {/* ── Latest Posts ─────────────────────────────────────── */}
            <div className="relative border-b border-border bg-background overflow-hidden bg-glow-top">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-muted hidden md:block"></div>
                <div className="absolute right-8 top-0 bottom-0 w-px bg-muted hidden md:block"></div>
                <div className="absolute left-8 top-8 w-2 h-2 rounded-full bg-primary/20 hidden md:block"></div>
                <div className="absolute left-8 bottom-8 w-2 h-2 rounded-full bg-primary/20 hidden md:block"></div>
                <div className="absolute right-8 top-8 w-2 h-2 rounded-full bg-primary/20 hidden md:block"></div>
                <div className="absolute right-8 bottom-8 w-2 h-2 rounded-full bg-primary/20 hidden md:block"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-border pb-8">
                        <div>
                            <div className="text-primary font-mono mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
                                01. WRITINGS
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold">
                                Latest{' '}
                                <span className="font-light italic text-foreground/60">
                                    Thoughts
                                </span>
                            </h2>
                        </div>
                        {nav.blog && (
                            <Link
                                href={nav.blog}
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-muted transition-all mt-4 md:mt-0 group"
                            >
                                Read all posts
                                <span className="transition-transform group-hover:translate-x-1">
                                    <Icon name="arrow-right" size={16} />
                                </span>
                            </Link>
                        )}
                    </div>

                    {latest_posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {latest_posts.map((post, i) => {
                                const accent =
                                    post.feed_image?.dominant_color_hex ?? null;
                                return (
                                    <AOS
                                        key={post.url}
                                        animation="fade-up"
                                        delay={i * 100 + 100}
                                    >
                                        <Link
                                            href={post.url}
                                            className="relative block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl group"
                                        >
                                            <Corners />
                                            {accent && (
                                                <div
                                                    className="h-1 w-full rounded-t-lg"
                                                    style={{
                                                        backgroundColor: accent,
                                                        opacity: 0.7,
                                                    }}
                                                />
                                            )}
                                            <div className="aspect-video relative overflow-hidden border-b border-border">
                                                {post.feed_image?.url ? (
                                                    <img
                                                        src={
                                                            post.feed_image.url
                                                        }
                                                        alt={
                                                            post.feed_image
                                                                .alt ?? ''
                                                        }
                                                        loading="lazy"
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center text-foreground/20 font-mono text-4xl"></div>
                                                )}
                                                <div className="absolute top-4 right-4 rounded-md border border-border bg-background/80 px-2 py-1 font-mono text-xs backdrop-blur-sm">
                                                    {post.first_published_at
                                                        ? new Date(
                                                              post.first_published_at,
                                                          ).toLocaleDateString(
                                                              'en-US',
                                                              {
                                                                  month: 'short',
                                                                  day: '2-digit',
                                                                  year: 'numeric',
                                                              },
                                                          )
                                                        : post.date}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="mb-2 text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="line-clamp-3 text-sm text-foreground/70">
                                                    {post.intro}
                                                </p>
                                                <div className="mt-4 flex w-full items-center justify-end border-t border-border/50 pt-4">
                                                    <div className="text-xs font-mono uppercase text-foreground/50 group-hover:text-primary transition-colors flex items-center gap-1">
                                                        Read Article{' '}
                                                        <Icon
                                                            name="arrow-right"
                                                            size={12}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </AOS>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-border bg-card/50 px-6 py-8 text-center text-foreground/70 shadow-lg">
                            Check back soon for new articles!
                        </div>
                    )}
                </div>
            </div>

            {/* ── Editable AOS Body Sections ──────────────────────── */}
            {body.length > 0 && (
                <div className="relative border-b border-border bg-background overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-12 left-12 w-1 h-1 rounded-full bg-primary/10"></div>
                        <div className="absolute top-24 right-24 w-1.5 h-1.5 rounded-full bg-primary/15"></div>
                        <div className="absolute bottom-12 left-1/3 w-1 h-1 rounded-full bg-secondary/10"></div>
                        <div className="absolute bottom-24 right-12 w-1 h-1 rounded-full bg-secondary/15"></div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative">
                        {body.map((block, i) => (
                            <BlockRenderer key={i} block={block} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Featured Projects ────────────────────────────────── */}
            <div
                id="projects"
                className="relative border-b border-border bg-card/30 overflow-hidden bg-glow-bottom"
            >
                <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-16 left-16 w-2 h-2 rounded-full bg-secondary/15"></div>
                    <div className="absolute top-32 left-32 w-1 h-1 rounded-full bg-secondary/10"></div>
                    <div className="absolute top-24 left-24 w-1.5 h-1.5 rounded-full bg-secondary/20"></div>
                    <div className="absolute bottom-16 right-16 w-2 h-2 rounded-full bg-primary/15"></div>
                    <div className="absolute bottom-32 right-32 w-1 h-1 rounded-full bg-primary/10"></div>
                    <div className="absolute bottom-24 right-24 w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                    <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-accent/10"></div>
                    <div className="absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full bg-accent/10"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative z-10">
                    <div className="mb-16 border-b border-border pb-8">
                        <div className="text-violet-300 font-mono mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/30"></span>
                            02. WORK
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Featured{' '}
                            <span className="font-light italic text-foreground/60">
                                Projects
                            </span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-24">
                        {featured_projects.length > 0 ? (
                            featured_projects.map((project, i) => (
                                <div key={project.url}>
                                    <div
                                        className={
                                            i % 2 === 0
                                                ? 'flex flex-col lg:flex-row gap-12 items-center group'
                                                : 'flex flex-col lg:flex-row-reverse gap-12 items-center group'
                                        }
                                    >
                                        <div className="w-full lg:w-2/5">
                                            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-primary/10">
                                                <div className="flex items-center gap-2 border-b border-border bg-card/50 px-3 py-2">
                                                    <div className="flex gap-1.5">
                                                        <span className="size-2.5 rounded-full bg-destructive/70"></span>
                                                        <span className="size-2.5 rounded-full bg-accent/70"></span>
                                                        <span className="size-2.5 rounded-full bg-primary/60"></span>
                                                    </div>
                                                    <div className="ml-2 flex-1 truncate rounded-md border border-border bg-background/60 px-3 py-1 font-mono text-xs text-foreground/50">
                                                        {project.demo_url || ''}
                                                    </div>
                                                </div>
                                                <div className="flex justify-center items-center bg-background aspect-video relative overflow-hidden text-foreground/40 font-black text-6xl select-none">
                                                    {project.image?.url ? (
                                                        <img
                                                            src={
                                                                project.image
                                                                    .url
                                                            }
                                                            alt={
                                                                project.image
                                                                    .alt ??
                                                                project.title
                                                            }
                                                            loading="lazy"
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <span>PROJECT</span>
                                                    )}
                                                    <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-full lg:w-3/5 space-y-8 ${i % 2 === 1 ? 'lg:text-right' : ''}`}
                                        >
                                            <h3 className="text-4xl font-bold tracking-tight">
                                                {project.title}
                                            </h3>
                                            <div
                                                className="text-xl text-foreground/80 leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: project.description,
                                                }}
                                            />
                                            <div
                                                className={`flex gap-4 ${i % 2 === 1 ? 'lg:justify-end' : ''} pt-2`}
                                            >
                                                {project.demo_url && (
                                                    <a
                                                        href={project.demo_url}
                                                        className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 font-medium text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-primary/30 transition-all"
                                                    >
                                                        Live Demo
                                                    </a>
                                                )}
                                                {project.github_url && (
                                                    <a
                                                        href={
                                                            project.github_url
                                                        }
                                                        className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 font-medium text-foreground hover:bg-muted transition-all"
                                                    >
                                                        GitHub
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {i < featured_projects.length - 1 && (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 h-px bg-muted/30"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/15"></div>
                                            <div className="w-16 h-px bg-muted/30"></div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-border bg-card/50 px-6 py-8 text-center text-foreground/70 shadow-lg">
                                No featured projects yet.
                            </div>
                        )}
                    </div>

                    {/* ── Bottom dotwork end marker ────────────────────────── */}
                    <div className="mt-24 hidden lg:flex items-center justify-center gap-3">
                        <div className="w-32 h-px bg-linear-to-r from-transparent to-foreground/10"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/15"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                        <div className="w-1 h-1 rounded-full bg-primary/25"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/15"></div>
                        <div className="w-32 h-px bg-linear-to-l from-transparent to-foreground/10"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
