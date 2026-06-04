import AOS from 'aos';
import 'aos/dist/aos.css';

function init() {
    AOS.init({
        duration: 600,
        easing: 'ease-out-quart',
        once: true,
        offset: 60,
        disable: false,
        anchorPlacement: 'top-bottom',
    });
    AOS.refresh();
}

// Ensure DOM is ready before init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    requestAnimationFrame(init);
}

// Re-init after HTMX swaps so dynamically loaded elements animate
document.body.addEventListener('htmx:swapComplete', () => {
    requestAnimationFrame(() => AOS.refresh());
});
