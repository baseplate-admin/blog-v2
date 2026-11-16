import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '$lib/utils';

const OFFSET: Record<string, string> = {
    'fade-up': 'translate-y-8',
    'fade-down': '-translate-y-8',
    'fade-right': '-translate-x-8',
    'fade-left': 'translate-x-8',
    'zoom-in': 'scale-75',
    'zoom-in-up': 'translate-y-6 scale-90',
    'zoom-in-down': '-translate-y-6 scale-90',
    'flip-up': 'rotate-x-12 opacity-0',
    'slide-up': 'translate-y-12',
};

interface Props {
    animation?: string;
    delay?: number;
    className?: string;
    children: ReactNode;
}

export default function AOS({ animation = 'fade-up', delay = 0, className = '', children }: Props) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setTimeout(() => setVisible(true), delay);
                        observer.disconnect();
                    }
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-700 ease-out will-change-transform',
                visible
                    ? 'opacity-100 translate-x-0 translate-y-0 rotate-x-0 scale-100'
                    : cn('opacity-0', OFFSET[animation] ?? OFFSET['fade-up']),
                className
            )}>
            {children}
        </div>
    );
}
