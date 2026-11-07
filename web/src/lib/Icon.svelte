<script lang="ts">
    /**
     * Thin wrapper over lucide-svelte so we can reference icons by a stable
     * string name (as serialized from the server) instead of importing each
     * icon component. Falls back to a generic icon for unknown names.
     */
    import * as Lucide from 'lucide-svelte';
    import { Circle } from 'lucide-svelte';
    import { cn } from '$lib/utils';

    // Map our server-side icon names to their lucide-svelte components.
    type LucideIcon = typeof Lucide.Circle;
    const ICON_MAP: Record<string, LucideIcon> = {
        'arrow-right': Lucide.ArrowRight,
        'arrow-left': Lucide.ArrowLeft,
        'arrow-up-right': Lucide.ArrowUpRight,
        search: Lucide.Search,
        moon: Lucide.Moon,
        sun: Lucide.Sun,
        menu: Lucide.Menu,
        x: Lucide.X,
        github: Lucide.GitBranch,
        'git-branch': Lucide.GitBranch,
        'external-link': Lucide.ExternalLink,
        'chevron-up': Lucide.ChevronUp,
        'chevron-down': Lucide.ChevronDown,
        calendar: Lucide.Calendar,
        list: Lucide.List,
        'lightning-bolt': Lucide.Zap,
        shield: Lucide.Shield,
        info: Lucide.Info,
        code: Lucide.Code,
        'chart-bar': Lucide.ChartBar,
        globe: Lucide.Globe,
        'puzzle-piece': Lucide.Blocks,
        circle: Lucide.Circle,
        bookmarked: Lucide.Bookmark,
        bookmark: Lucide.Bookmark,
        history: Lucide.History,
        'message-circle': Lucide.MessageCircle,
        'alert-circle': Lucide.CircleAlert,
        aperture: Lucide.Aperture,
        asterisk: Lucide.Asterisk,
        'at-sign': Lucide.AtSign,
        compass: Lucide.Compass,
        crosshair: Lucide.Crosshair,
        gem: Lucide.Gem,
        diamond: Lucide.Diamond,
        hexagon: Lucide.Hexagon,
        minus: Lucide.Minus,
        plus: Lucide.Plus,
        radar: Lucide.Radar,
        sparkles: Lucide.Sparkles,
        snowflake: Lucide.Snowflake,
        target: Lucide.Target,
        wand: Lucide.Wand,
        waves: Lucide.Waves,
        wind: Lucide.Wind,
        flower: Lucide.Flower,
        heart: Lucide.Heart,
        infinity: Lucide.Infinity,
        'moon-star': Lucide.MoonStar,
        star: Lucide.Star,
        crown: Lucide.Crown,
        feather: Lucide.Feather,
        droplet: Lucide.Droplet,
        flame: Lucide.Flame,
        leaf: Lucide.Leaf,
        zap: Lucide.Zap,
        orbit: Lucide.Orbit,
        prism: Lucide.Diamond,
        cross: Lucide.Plus,
        sunrise: Lucide.Sunrise,
        atlas: Lucide.Globe,
        clock: Lucide.Clock,
        'book-open': Lucide.BookOpen,
        folder: Lucide.Folder,
        tag: Lucide.Tag,
        link: Lucide.Link,
        download: Lucide.Download,
        layers: Lucide.Layers,
        box: Lucide.Box,
        rocket: Lucide.Rocket,
        check: Lucide.Check,
        'check-circle': Lucide.CircleCheck,
        'x-circle': Lucide.CircleX,
        'check-circle-2': Lucide.CircleCheckBig,
    };

    let {
        name,
        size = 20,
        class: className = '',
        strokeWidth = 2,
        ...rest
    }: {
        name: string;
        size?: number;
        class?: string;
        strokeWidth?: number;
    } & Record<string, unknown> = $props();

    const Component = $derived(ICON_MAP[name] ?? Circle);
</script>

<Component
    {size}
    {strokeWidth}
    {...rest}
    class={cn(className)}
    aria-hidden="true"
/>
