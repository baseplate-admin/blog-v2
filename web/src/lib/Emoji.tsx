/**
 * Renders a Twemoji as an inline React SVG component, sourced from
 * `web/src/vendor/twemoji/svg/`.
 *
 * Each SVG is converted to a React component by SVGR (Vite's `?react` query)
 * and lazy-loaded per codepoint via `import.meta.glob` (one chunk each).
 * Because the graphic is a real React element (not injected HTML), it can be
 * CSS-styled normally: width/height, `filter`, `clip-path`, opacity, ...
 *
 * ```tsx
 * <Emoji value={'✨'} className="inline h-5 w-5 align-[-0.125em]" />
 * <Emoji codepoint="1f600" className="h-8 w-8" />
 * ```
 *
 * Twemoji graphics are CC-BY 4.0; credit "Twemoji (CC-BY 4.0)" somewhere
 * visible (e.g. the footer).
 *
 * Note: the SVGs ship with hardcoded `fill` colors, so `text-*` /
 * `currentColor` will not recolor them. Use `filter` or `clip-path` if
 * you need to adapt them to your theme.
 */
import type { ComponentType, ReactElement, SVGProps } from 'react';
import { isValidElement } from 'react';
import twemoji from 'twemoji';
import { cn } from '$lib/utils';

// SVGR-emitted components accept standard SVG props (className, width, ...).
// The value may be a component function OR a React element (when webpack's
// ESM interop wraps the SVGR output in a `__webpack_require__.d` getter that
// evaluates to an element on access).
type SvgModule = ComponentType<SVGProps<SVGSVGElement>> | ReactElement;

// Eager context of every Twemoji SVG, each transformed into a React component
// by @svgr/webpack. Webpack's `require.context` replaces Vite's
// `import.meta.glob(..., { query: '?react' })`. The key is the relative path
// (e.g. "./1f600.svg"); we strip the "./" to match the codepoint lookup.
const emojiContext = require.context(
    '../vendor/twemoji/svg',
    false,
    /\.svg$/,
);
const TWEMOJI: Record<string, SvgModule> = {};
emojiContext.keys().forEach((key) => {
    // Strip the "./" prefix and the ".svg" suffix to get the bare codepoint.
    const codepoint = key.replace(/^\.\//, '').replace(/\.svg$/, '');
    TWEMOJI[codepoint] = (emojiContext(key) as { default: SvgModule })
        .default;
});

interface EmojiProps {
    /** Emoji character, e.g. "✨". Ignored if `codepoint` is set. */
    value?: string;
    /** Hex codepoint string, e.g. "1f600" or "1f1e8-1f1f3". */
    codepoint?: string;
    className?: string;
}

export default function Emoji({
    value,
    codepoint,
    className = 'inline h-[1.2em] w-[1.2em] align-[-0.15em]',
}: EmojiProps) {
    // Resolve to a lowercase hex codepoint string, or '' if neither given.
    const cp =
        codepoint ??
        (value ? twemoji.convert.toCodePoint(value).toLowerCase() : '');

    // Eager lookup: the module was imported at module load time.
    const Comp = cp ? TWEMOJI[cp] : undefined;

    if (Comp) {
        // webpack's ESM interop can wrap the SVGR output so that `default`
        // resolves to a React element (object) rather than a component
        // function. Detect and handle both shapes.
        const content = isValidElement(Comp) ? (
            Comp
        ) : (
            // @ts-expect-error -- Comp is a ComponentType here, not an element.
            <Comp className="h-full w-full" />
        );
        return (
            <span
                aria-hidden="true"
                className={cn(className, '[&>svg]:h-full [&>svg]:w-full')}
            >
                {content}
            </span>
        );
    }
    return (
        <span aria-hidden="true" className={className}>
            {cp ? '?' : ''}
        </span>
    );
}
