<svelte:options
    customElement={{
        tag: 'right-arrow-icon',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { MoveLeft } from '@lucide/svelte';

    let { class: klass } = $props();
</script>

<MoveLeft class={klass} />
