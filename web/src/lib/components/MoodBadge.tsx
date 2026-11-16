import { cn } from '$lib/utils';
import { moodBadge } from '$lib/badges';

interface Props {
    mood: string;
    size?: 'sm' | 'md';
    className?: string;
}

export default function MoodBadge({ mood, size = 'md', className = '' }: Props) {
    const badge = moodBadge(mood);
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
                badge.colors.bg,
                badge.colors.text,
                badge.colors.border,
                className
            )}>
            <span className={cn('size-1.5 rounded-full', badge.colors.dot)} />
            {badge.label}
        </span>
    );
}
