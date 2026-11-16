import { Fragment, useMemo, type ReactNode } from 'react';
import Emoji from '$lib/Emoji';

// Matches (in priority order):
//  1. regional-indicator pairs (flags, e.g. FR)
//  2. ZWJ sequences (e.g. woman office worker)
//  3. variation-selector sequences (e.g. heart)
//  4. lone emoji code points (e.g. sparkles)
const EMOJI_RE =
    /\p{RI}{2}|\p{Extended_Pictographic}(?:‍\p{Extended_Pictographic})+|\p{Extended_Pictographic}️?|\p{Extended_Pictographic}/gu;

/**
 * Parses a rich-text HTML string into React nodes, replacing every emoji
 * character with a Twemoji SVG (`<Emoji>`). Non-emoji content keeps its
 * inline tags (`<strong>`, `<a>`, ...) but is rendered as real React
 * elements instead of `dangerouslySetInnerHTML`.
 *
 * The parse runs once per HTML string (memoized on `html`).
 */
export function parseEmojiHtml(html: string): ReactNode {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return Array.from(doc.body.childNodes).map((node, i) => {
        const walk = (n: Node, k: number): ReactNode => {
            if (n.nodeType === Node.ELEMENT_NODE) {
                const el = n as Element;
                const tag = el.tagName.toLowerCase();
                const props: Record<string, string> = {};
                if (tag === 'a') {
                    props.href = el.getAttribute('href') ?? '#';
                    props.target = '_blank';
                    props.rel = 'noopener noreferrer';
                }
                return (
                    <Fragment key={k}>
                        <span {...props}>
                            {Array.from(n.childNodes).map((c, j) => walk(c, j))}
                        </span>
                    </Fragment>
                );
            }
            if (n.nodeType === Node.TEXT_NODE) {
                const text = n.nodeValue ?? '';
                const parts: ReactNode[] = [];
                let last = 0;
                for (const m of text.matchAll(EMOJI_RE)) {
                    const idx = m.index ?? 0;
                    if (idx > last) parts.push(text.slice(last, idx));
                    const matched = m[0];
                    // Convert to the vendor codepoint filename:
                    // ZWJ sequences and flags keep their separators;
                    // variation selectors are dropped.
                    // Array.from() is code-point-aware (splits on code points,
                    // not UTF-16 units) so emoji in the surrogate range work.
                    const cp = Array.from(matched)
                        .map((c) =>
                            c.codePointAt(0) === 0x200d
                                ? '200d'
                                : c.codePointAt(0) === 0xfe0f
                                  ? ''
                                  : c.codePointAt(0)!.toString(16),
                        )
                        .join('-');
                    parts.push(
                        <Emoji
                            key={`e${idx}`}
                            codepoint={cp}
                            fallback={matched}
                            className="inline h-[1.2em] w-[1.2em] align-[-0.15em]"
                        />,
                    );
                    last = idx + matched.length;
                }
                if (last < text.length) parts.push(text.slice(last));
                return <Fragment key={k}>{parts}</Fragment>;
            }
            return null;
        };
        return walk(node, i);
    });
}

interface EmojiTextProps {
    html: string;
}

export default function EmojiText({ html }: EmojiTextProps) {
    const nodes = useMemo(() => parseEmojiHtml(html), [html]);
    return <>{nodes}</>;
}
