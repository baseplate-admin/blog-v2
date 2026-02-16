<svelte:options
    customElement={{
        tag: 'toc-icon',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { TableOfContents } from '@lucide/svelte';

    let { class: klass } = $props();
</script>

<TableOfContents class={klass} />
