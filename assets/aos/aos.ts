import AOS from 'aos';
import 'aos/dist/aos.css';

const AOS_OPTIONS = {
    duration: 600,
    easing: 'ease-out-quart',
    once: true,
    offset: 60,
    disable: false,
    anchorPlacement: 'top-bottom',
};

function init() {
    AOS.init(AOS_OPTIONS);
    AOS.refresh();
    // Mark already-visible elements as animated
    document.querySelectorAll('[data-aos]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('aos-animate');
        }
    });
}

// Fire immediately if DOM is ready, otherwise wait for DOMContentLoaded
// CSS loads before JS in <head>, so animations start as soon as the DOM is painted
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

// After HTMX swaps, re-init AOS for new elements
document.body.addEventListener('htmx:after:swap', () => {
    requestAnimationFrame(() => {
        AOS.init(AOS_OPTIONS);
        AOS.refresh();
        document.querySelectorAll('[data-aos]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('aos-animate');
            }
        });
    });
});
