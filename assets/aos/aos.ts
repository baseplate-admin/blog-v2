import AOS from 'aos';
import 'aos/dist/aos.css';

// github.blog-style: subtle fade-up, no overshoot
AOS.init({
    duration: 600,
    easing: 'ease-out-quart',
    once: true,
    offset: 60,
    disable: false,
    anchorPlacement: 'top-bottom',
});

// Re-init after HTMX swaps so dynamically loaded elements animate
document.body.addEventListener('htmx:swapComplete', () => {
    AOS.refresh();
});
