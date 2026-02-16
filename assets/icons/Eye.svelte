<svelte:options
    customElement={{
        tag: 'eye-icon',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { Eye } from '@lucide/svelte';

    let { class: klass } = $props();
</script>

<Eye class={klass} />
