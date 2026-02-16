<svelte:options
    customElement={{
        tag: 'x-icon',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { X } from '@lucide/svelte';

    let { class: klass } = $props();
</script>

<X class={klass} />
