/** Shared prop types for the Inertia + Svelte frontend. */

export interface Nav {
    blog: string | null;
    projects: string | null;
    about: string | null;
    contact: string | null;
}

export interface Site {
    site_name: string;
    copyright_from: number | null;
    copyright_to: number | null;
    license_type: string | null;
    license_label: string;
}

export interface Meta {
    title: string;
    seo_title: string | null;
    search_description: string | null;
    og_type: string;
    og_image: string | null;
    og_image_alt: string | null;
    site_name: string;
    og_url: string | null;
}

/** Props shared by every page (site chrome). */
export interface SharedProps {
    nav: Nav;
    site: Site;
    meta: Meta;
    current_path: string | null;
}

export interface UserRef {
    id: number;
    username: string;
}

export interface ImageValue {
    url: string | null;
    alt: string;
    width: number | null;
    height: number | null;
    dominant_color_hex: string | null;
}

/** Generic StreamField block: `<block name>` + its dumped value. */
export interface Block<T = unknown> {
    type: string;
    value: T;
}

/** Generic page dump produced by `mixins/inertia/base.py`. */
export interface PageBase {
    url: string;
    title: string;
    slug: string;
    model: string;
    owner: UserRef | null;
    first_published_at: string | null;
    last_published_at: string | null;
    search_description: string;
    seo_title: string;
    show_in_menus: boolean;
    feed_image?: ImageValue | null;
}

export interface BlogPageData extends PageBase {
    date: string;
    mood: string;
    intro: string;
    body: Block[];
    tags: string[];
    license_type: string;
    feed_image: ImageValue | null;
}

export interface ProjectPageData extends PageBase {
    description: string;
    github_url: string;
    demo_url: string;
    image: ImageValue | null;
    gh_full_name: string;
    gh_description: string;
    gh_stars: number;
    gh_forks: number;
    gh_language: string;
    gh_last_updated: string | null;
}

export interface Paginator<T> {
    items: T[];
    number: number;
    num_pages: number;
    count: number;
    has_next: boolean;
    has_previous: boolean;
}

export interface TocItem {
    id: string;
    text: string;
    level: string;
}

export interface TagCount {
    tag__name: string;
    count: number;
}

export type MoodChoice = [string, string];

// ── StreamField block value shapes ────────────────────────────────────────────
// `InertiaMixin` dumps each block as `{ type: <block name>, value: <fields> }`.

export interface ParagraphBlock {
    type: "paragraph";
    value: string;
}

export interface AOSHeadingBlock {
    type: "aos_heading";
    value: { text: string; level: "h2" | "h3" | "h4"; animation: string; delay: string };
}

export interface AOSQuoteBlock {
    type: "aos_quote";
    value: { quote: string; attribution: string; animation: string; delay: string };
}

export interface AOSHighlightBlock {
    type: "aos_highlight";
    value: { text: string; variant: string; animation: string; delay: string };
}

export interface SeparatorBlock {
    type: "separator";
    value: { style: string };
}

export interface ImageBlock {
    type: "image";
    value: ImageValue;
}

export interface InlineImageBlock {
    type: "inline_image";
    value: { image: ImageValue; caption: string };
}

export interface MermaidBlock {
    type: "mermaid";
    value: { code: string; theme: string };
}

export interface CodeBlock {
    type: "code";
    value: {
        language: string;
        code: string;
        footer_text: string;
        highlighted: string;
        raw_code: string;
        language_display: string;
    };
}

export interface CalloutBlock {
    type: "callout";
    value: { title: string; body: string; variant: string };
}

export interface StatsGridBlock {
    type: "stats_grid";
    value: { stats: { value: string; label: string }[] };
}

export interface CardGridBlock {
    type: "card_grid";
    value: { cards: { title: string; description: string; icon: string }[] };
}

export interface TabsBlock {
    type: "tabs";
    value: {
        tabs: { title: string; content: string; icon: string }[];
        variant: string;
    };
}

export interface TimelineBlock {
    type: "timeline";
    value: {
        items: { title: string; description: string; timestamp: string }[];
        compact: boolean;
    };
}

export interface StepsBlock {
    type: "steps";
    value: {
        steps: { title: string; description: string }[];
        active_step: number;
        vertical: boolean;
    };
}

export interface AlertBlock {
    type: "alert";
    value: { title: string; message: string; variant: string };
}

export interface TooltipBlock {
    type: "tooltip";
    value: {
        inner_text: string;
        tooltip_text: string;
        placement: string;
        variant: string;
    };
}

export type StreamBlock =
    | ParagraphBlock
    | AOSHeadingBlock
    | AOSQuoteBlock
    | AOSHighlightBlock
    | SeparatorBlock
    | ImageBlock
    | InlineImageBlock
    | MermaidBlock
    | CodeBlock
    | CalloutBlock
    | StatsGridBlock
    | CardGridBlock
    | TabsBlock
    | TimelineBlock
    | StepsBlock
    | AlertBlock
    | TooltipBlock;
