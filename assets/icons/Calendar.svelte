<svelte:options
    customElement={{
        tag: 'calendar-icon',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { CalendarArrowUp } from '@lucide/svelte';

    let { class: klass } = $props();
</script>

<CalendarArrowUp class={klass} />
