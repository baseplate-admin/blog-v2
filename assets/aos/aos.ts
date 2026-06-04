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

// After HTMX swaps, handle AOS for new elements
document.body.addEventListener('htmx:after:swap', () => {
    // Immediately show all data-aos elements that are in viewport
    requestAnimationFrame(() => {
        AOS.refresh();
        // Force-show elements that are in viewport
        document.querySelectorAll('[data-aos]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('aos-animate');
            }
        });
    });
});
