import { useState } from 'react';
import { cn } from '$lib/utils';
import Icon from '$lib/Icon';
import EmojiText from '$lib/blocks/EmojiText';
import type { TabsBlock } from '$lib/types';

export default function TabsBlock({ block }: { block: TabsBlock }) {
    const tabs = block.value.tabs;
    const [active, setActive] = useState(0);

    return (
        <div className="my-8">
            <div className="flex w-full max-w-fit flex-wrap gap-1">
                {tabs.map((tab, i) => (
                    <button
                        key={tab.title}
                        type="button"
                        className={cn(
                            'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            active === i
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground/60 hover:bg-muted hover:text-foreground',
                        )}
                        onClick={() => setActive(i)}>
                        {tab.icon && <Icon name={tab.icon} className="size-4" />}
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-card/40 p-5">
                <EmojiText html={tabs[active].content} />
            </div>
        </div>
    );
}
