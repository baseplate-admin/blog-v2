import Icon from '$lib/Icon';
import AOS from '$lib/blocks/AOS';
import { formatDate } from '$lib/utils';
import type { ImageValue, Nav } from '$lib/types';

interface Props {
    title: string;
    description: string;
    github_url: string;
    demo_url: string;
    image: ImageValue | null;
    gh_full_name: string | null;
    gh_description: string | null;
    gh_stars: number | null;
    gh_forks: number | null;
    gh_language: string | null;
    gh_last_updated: string | null;
    nav: Nav;
}

export default function ProjectPage({
    title,
    description,
    github_url,
    demo_url,
    image,
    gh_stars,
    gh_forks,
    gh_language,
    gh_last_updated,
    nav,
}: Props) {
    const imageUrl = image?.url ?? null;
    const imageAlt = image?.alt ?? '';
    const lastUpdated = formatDate(gh_last_updated);
    const parentUrl = nav.projects ?? '/projects/';

    return (
        <div className="relative flex-1">
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-24 relative z-10">
                <div className="text-primary font-mono mb-4 text-sm tracking-widest">
                    <a href={parentUrl} className="hover:underline">BACK TO PROJECTS</a>
                </div>

                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight max-w-4xl tracking-tight">
                    {title}
                </h1>

                {(github_url || demo_url) && (
                    <div className="flex flex-wrap gap-4 mb-12">
                        {github_url && (
                            <a href={github_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-5 font-medium text-foreground hover:bg-muted transition-colors">
                                <Icon name="github" size={20} /> View Source
                            </a>
                        )}
                        {demo_url && (
                            <a href={demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                <Icon name="external-link" size={20} /> Live Demo
                            </a>
                        )}
                    </div>
                )}

                {(gh_stars != null || gh_forks != null || gh_language || lastUpdated) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div className="rounded-2xl border border-border bg-card p-4">
                            <div className="flex items-center gap-2 text-foreground/50 text-xs font-mono tracking-wider">
                                <Icon name="star" size={14} /> STARS
                            </div>
                            <div className="text-3xl font-black mt-1">{gh_stars ?? 0}</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-4">
                            <div className="flex items-center gap-2 text-foreground/50 text-xs font-mono tracking-wider">
                                <Icon name="git-branch" size={14} /> FORKS
                            </div>
                            <div className="text-3xl font-black mt-1">{gh_forks ?? 0}</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-4">
                            <div className="flex items-center gap-2 text-foreground/50 text-xs font-mono tracking-wider">
                                <Icon name="code" size={14} /> LANGUAGE
                            </div>
                            <div className="text-lg font-bold mt-1">{gh_language || '-'}</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-4">
                            <div className="flex items-center gap-2 text-foreground/50 text-xs font-mono tracking-wider">
                                <Icon name="history" size={14} /> LAST PUSH
                            </div>
                            <div className="text-lg font-bold mt-1">{lastUpdated || '-'}</div>
                        </div>
                    </div>
                )}

                {imageUrl && (
                    <figure className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-foreground/10 mb-16">
                        <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" loading="eager" />
                    </figure>
                )}

                <div
                    className="prose prose-lg prose-invert md:prose-xl max-w-4xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: description }}
                />

                <div className="border-t border-border mt-24 pt-12 flex justify-between items-center">
                    <a href={parentUrl} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 font-medium text-foreground hover:bg-muted transition-colors">Start Over</a>
                    <button
                        className="flex size-11 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted transition-colors"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Icon name="chevron-up" size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
}
