import AOS from '$lib/blocks/AOS';
import type { StatsGridBlock } from '$lib/types';

export default function StatsGrid({ block }: { block: StatsGridBlock }) {
    const stats = block.value.stats;
    return (
        <div className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <AOS key={stat.label} animation="fade-up" delay={i * 80}>
                    <div className="rounded-2xl border border-border bg-card/40 p-6">
                        <div className="flex flex-col items-center gap-1 text-center">
                            <span className="text-3xl font-bold text-primary">{stat.value}</span>
                            <span className="text-sm text-foreground/60">{stat.label}</span>
                        </div>
                    </div>
                </AOS>
            ))}
        </div>
    );
}
