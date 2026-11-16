import BlockRenderer from '$lib/blocks/BlockRenderer';
import type { StreamBlock } from '$lib/types';

interface Props {
    title: string;
    body?: StreamBlock[] | string;
}

export default function Generic({ title, body }: Props) {
    return (
        <div className="relative">
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
            <article className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-24 relative z-10">
                <h1 className="mb-8 text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
                    {title}
                </h1>
                {Array.isArray(body) ? (
                    <div className="max-w-4xl">
                        {body.map((block, i) => (
                            <BlockRenderer key={i} block={block} />
                        ))}
                    </div>
                ) : body ? (
                    <div
                        className="prose prose-lg prose-invert max-w-4xl text-foreground/80"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                ) : null}
            </article>
        </div>
    );
}
