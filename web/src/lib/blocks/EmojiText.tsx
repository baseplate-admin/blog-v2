import { createElement, Fragment, useMemo, type ReactNode } from 'react';
import Emoji from '$lib/Emoji';

// Matches (in priority order):
//  1. regional-indicator pairs (flags, e.g. FR)
//  2. ZWJ sequences (e.g. woman office worker)
//  3. variation-selector sequences (e.g. heart)
//  4. lone emoji code points (e.g. sparkles)
const EMOJI_RE =
    /\p{RI}{2}|\p{Extended_Pictographic}(?:‍\p{Extended_Pictographic})+|\p{Extended_Pictographic}️?|\p{Extended_Pictographic}/gu;

// Inline/block tags the Wagtail editor can emit. Anything else is rendered
// as a <span> so unexpected markup cannot create arbitrary elements.
const ALLOWED_TAGS = new Set([
    'a', 'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'code', 'pre',
    'span', 'blockquote', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'h5', 'h6',
    'figure', 'figcaption', 'img', 'hr', 'table', 'thead', 'tbody', 'tr',
    'th', 'td', 'sub', 'sup',
]);
const VOID_TAGS = new Set(['br', 'hr', 'img']);

// HTML attribute names that differ from their React prop names.
const ATTR_MAP: Record<string, string> = {
    class: 'className',
    for: 'htmlFor',
    colspan: 'colSpan',
    rowspan: 'rowSpan',
    tabindex: 'tabIndex',
    datetime: 'dateTime',
    readonly: 'readOnly',
};

function renderElement(el: Element, key: number): ReactNode {
    const tag = ALLOWED_TAGS.has(el.tagName.toLowerCase())
        ? el.tagName.toLowerCase()
        : 'span';

    const props: Record<string, unknown> = { key };
    for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        // Never pass event handlers from content.
        if (name.startsWith('on')) continue;
        props[ATTR_MAP[name] ?? name] = attr.value;
    }

    const children = VOID_TAGS.has(tag)
        ? undefined
        : Array.from(el.childNodes).map((child, i) => renderNode(child, i));

    return createElement(tag, props, children);
}

function renderText(text: string, key: number): ReactNode {
    const parts: ReactNode[] = [];
    let last = 0;

    for (const match of text.matchAll(EMOJI_RE)) {
        const index = match.index ?? 0;
        if (index > last) parts.push(text.slice(last, index));

        const matched = match[0];
        // Convert to the vendor codepoint filename: ZWJ sequences and flags
        // keep their separators; variation selectors are dropped.
        // Array.from() is code-point-aware (splits on code points, not UTF-16
        // units) so emoji in the surrogate range work.
        const codepoint = Array.from(matched)
            .map((char) =>
                char.codePointAt(0) === 0x200d
                    ? '200d'
                    : char.codePointAt(0) === 0xfe0f
                      ? ''
                      : char.codePointAt(0)!.toString(16),
            )
            .join('-');

        parts.push(
            <Emoji
                key={`e${index}`}
                codepoint={codepoint}
                fallback={matched}
                className="inline-block h-[1.2em] w-[1.2em] align-[-0.15em]"
            />,
        );
        last = index + matched.length;
    }

    if (last < text.length) parts.push(text.slice(last));
    return <Fragment key={key}>{parts}</Fragment>;
}

function renderNode(node: Node, key: number): ReactNode {
    if (node.nodeType === Node.ELEMENT_NODE) {
        return renderElement(node as Element, key);
    }
    if (node.nodeType === Node.TEXT_NODE) {
        return renderText(node.nodeValue ?? '', key);
    }
    return null;
}

/**
 * Parses a rich-text HTML string into React nodes, replacing every emoji
 * character with a Twemoji SVG (`<Emoji>`). Non-emoji markup keeps its real
 * tags (`<strong>`, `<em>`, `<code>`, `<a>`, lists, headings, ...) instead of
 * being flattened to spans, and is rendered as React elements rather than
 * `dangerouslySetInnerHTML`.
 *
 * The parse runs once per HTML string (memoized on `html`).
 */
export function parseEmojiHtml(html: string): ReactNode {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return Array.from(doc.body.childNodes).map((node, i) => renderNode(node, i));
}

interface EmojiTextProps {
    html: string;
}

export default function EmojiText({ html }: EmojiTextProps) {
    const nodes = useMemo(() => parseEmojiHtml(html), [html]);
    return <>{nodes}</>;
}
