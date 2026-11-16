import { cn } from '$lib/utils';
import { licenseBadge } from '$lib/badges';

interface Props {
    license: string;
    className?: string;
}

export default function LicenseBadge({ license, className = '' }: Props) {
    const badge = licenseBadge(license);
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium',
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
