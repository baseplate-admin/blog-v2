<svelte:options
    customElement={{
        tag: 'progress-bar',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { onMount } from 'svelte';

    let width = $state(0);

    onMount(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const b = document.body;
            const scrollTop = h.scrollTop || b.scrollTop;
            const scrollHeight =
                (h.scrollHeight || b.scrollHeight) - h.clientHeight;
            width =
                scrollHeight > 0
                    ? Math.min((scrollTop / scrollHeight) * 100, 100)
                    : 0;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    });
</script>

<div class="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
    <div
        class="h-full bg-primary transition-[width] duration-75 ease-out shadow-[0_0_10px_var(--color-primary)]"
        style="width: {width}%"
    ></div>
</div>
