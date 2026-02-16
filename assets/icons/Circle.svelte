<svelte:options
    customElement={{
        tag: 'circle-icon',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { Circle } from '@lucide/svelte';

    let { class: klass } = $props();
</script>

<Circle class={klass} />
