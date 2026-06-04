import { createIcons } from 'lucide';

// All icons used in templates (imported explicitly to avoid tree-shaking)
import ArrowRight from 'lucide/dist/esm/icons/arrow-right.mjs';
import ArrowLeft from 'lucide/dist/esm/icons/arrow-left.mjs';
import Search from 'lucide/dist/esm/icons/search.mjs';
import Moon from 'lucide/dist/esm/icons/moon.mjs';
import Sun from 'lucide/dist/esm/icons/sun.mjs';
import Menu from 'lucide/dist/esm/icons/menu.mjs';
import X from 'lucide/dist/esm/icons/x.mjs';
import Github from 'lucide/dist/esm/icons/github.mjs';
import ExternalLink from 'lucide/dist/esm/icons/external-link.mjs';
import ChevronUp from 'lucide/dist/esm/icons/chevron-up.mjs';
import Calendar from 'lucide/dist/esm/icons/calendar.mjs';
import List from 'lucide/dist/esm/icons/list.mjs';
import LightningBolt from 'lucide/dist/esm/icons/lightning-bolt.mjs';
import Shield from 'lucide/dist/esm/icons/shield.mjs';
import Info from 'lucide/dist/esm/icons/info.mjs';
import Code from 'lucide/dist/esm/icons/code.mjs';
import ChartBar from 'lucide/dist/esm/icons/chart-bar.mjs';
import Globe from 'lucide/dist/esm/icons/globe.mjs';
import PuzzlePiece from 'lucide/dist/esm/icons/puzzle-piece.mjs';

// Build icon registry with kebab-case names matching data-lucide attributes
const icons: Record<string, any[]> = {
    'arrow-right': ArrowRight,
    'arrow-left': ArrowLeft,
    'search': Search,
    'moon': Moon,
    'sun': Sun,
    'menu': Menu,
    'x': X,
    'github': Github,
    'external-link': ExternalLink,
    'chevron-up': ChevronUp,
    'calendar': Calendar,
    'list': List,
    'lightning-bolt': LightningBolt,
    'shield': Shield,
    'info': Info,
    'code': Code,
    'chart-bar': ChartBar,
    'globe': Globe,
    'puzzle-piece': PuzzlePiece,
};

function renderIcons() {
    createIcons({
        icons,
        attrs: {
            'stroke-width': 1.5,
            width: 20,
            height: 20,
        },
    });
}

// Initial render
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderIcons);
} else {
    requestAnimationFrame(renderIcons);
}

// Re-render after HTMX swaps so dynamic content gets icons
document.body.addEventListener('htmx:after:swap', () => {
    setTimeout(renderIcons, 50);
});
