import { Link, usePage } from '@inertiajs/react';
import Icon from '$lib/Icon';
import AOS from '$lib/blocks/AOS';
import type { Nav, ProjectPageData } from '$lib/types';

interface Props {
    intro?: string;
    projects?: ProjectPageData[];
    nav: Nav;
}

export default function ProjectIndex({ intro = '', projects = [], nav }: Props) {
    const pageTitle = (usePage().props as { title?: string }).title ?? 'Projects';

    return (
        <>
            <div className="relative w-full border-b border-border overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative z-10">
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-muted hidden md:block"></div>
                    <div className="absolute right-8 top-0 bottom-0 w-px bg-muted hidden md:block"></div>
                    <div className="max-w-3xl pl-0 md:pl-12">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                            <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">{pageTitle}</span>
                        </h1>
                        {intro && (
                            <div
                                className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl"
                                dangerouslySetInnerHTML={{ __html: intro }}
                            />
                        )}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-secondary to-transparent opacity-50"></div>
            </div>

            <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-muted hidden md:block opacity-50"></div>
                <div className="absolute right-8 top-0 bottom-0 w-px bg-muted hidden md:block opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative z-10">
                    {projects.length > 0 ? (
                        <div className="space-y-32">
                            {projects.map((project, i) => (
                                <div key={project.url}>
                                    <div
                                        className={
                                            i % 2 === 0
                                                ? 'group relative flex flex-col lg:flex-row gap-12 items-center'
                                                : 'group relative flex flex-col lg:flex-row-reverse gap-12 items-center'
                                        }>
                                        <div className="w-full lg:w-3/5 relative">
                                            <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl transition-transform duration-500 hover:shadow-secondary/10 group-hover:scale-[1.01]">
                                                <div className="aspect-video bg-card block w-full">
                                                    {project.image?.url ? (
                                                        <img
                                                            src={project.image.url}
                                                            alt={project.image.alt ?? project.title}
                                                            loading="lazy"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                                            <Icon name="folder" size={48} className="text-foreground/20" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-background/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                            </div>
                                            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-border -z-10 rounded-tl-3xl opacity-60"></div>
                                            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-border -z-10 rounded-br-3xl opacity-60"></div>
                                        </div>

                                        <div className="w-full lg:w-2/5 space-y-8 relative z-10">
                                            <div className="space-y-4">
                                                <h2 className="text-4xl md:text-5xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                                                    <Link href={project.url}>{project.title}</Link>
                                                </h2>
                                                <div className="w-12 h-1 bg-secondary rounded-full"></div>
                                            </div>
                                            {project.gh_full_name && (
                                                <div className="flex items-center gap-2 text-sm text-foreground/50 font-mono">
                                                    <span className="text-foreground/30"><Icon name="github" size={14} /></span>
                                                    {project.gh_full_name}
                                                </div>
                                            )}
                                            <div
                                                className="prose prose-lg prose-invert text-foreground/80"
                                                dangerouslySetInnerHTML={{ __html: project.description }}
                                            />
                                            <div className="flex flex-wrap gap-4 items-center">
                                                <Link href={project.url} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 font-medium text-foreground hover:bg-muted transition-colors group/btn">
                                                    View Details
                                                    <span className="rotate-90 transition-transform group-hover/btn:translate-x-1"><Icon name="arrow-right" size={16} /></span>
                                                </Link>
                                                {project.github_url && (
                                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex size-10 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted transition-colors" aria-label="GitHub">
                                                        <Icon name="github" size={20} />
                                                    </a>
                                                )}
                                                {project.demo_url && (
                                                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex size-10 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted transition-colors" aria-label="Live Demo">
                                                        <Icon name="external-link" size={20} />
                                                    </a>
                                                )}
                                                {project.gh_stars > 0 && (
                                                    <div className="flex items-center gap-1 text-sm text-foreground/60">
                                                        <Icon name="star" size={16} />
                                                        <span>{project.gh_stars}</span>
                                                    </div>
                                                )}
                                                {project.gh_forks > 0 && (
                                                    <div className="flex items-center gap-1 text-sm text-foreground/60">
                                                        <Icon name="git-branch" size={16} />
                                                        <span>{project.gh_forks}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-muted"></div>
                                    </div>
                                    {i < projects.length - 1 && (
                                        <div className="w-px h-24 bg-muted mx-auto opacity-50"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <h3 className="text-2xl font-bold mb-2">Work in Progress</h3>
                            <p className="text-foreground/60">Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
