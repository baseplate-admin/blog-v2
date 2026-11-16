import type { ReactNode } from 'react';
import { cn } from '$lib/utils';
import AOS from '$lib/blocks/AOS';
import type { AOSHeadingBlock } from '$lib/types';

export default function Heading({ block, id }: { block: AOSHeadingBlock; id?: string }) {
    const value = block.value;
    const size =
        value.level === 'h2'
            ? 'text-2xl sm:text-3xl'
            : value.level === 'h3'
              ? 'text-xl sm:text-2xl'
              : 'text-lg sm:text-xl';
    const headingClass = cn('mt-10 mb-4 scroll-mt-24 font-bold tracking-tight text-foreground/85', size);

    const heading: ReactNode =
        value.level === 'h4' ? (
            <h4 id={id} data-toc={id} className={headingClass}>
                {value.text}
            </h4>
        ) : value.level === 'h3' ? (
            <h3 id={id} data-toc={id} className={headingClass}>
                {value.text}
            </h3>
        ) : (
            <h2 id={id} data-toc={id} className={headingClass}>
                {value.text}
            </h2>
        );

    return <AOS animation={value.animation} delay={Number(value.delay)}>{heading}</AOS>;
}
