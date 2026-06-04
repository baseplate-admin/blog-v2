<svelte:options
    customElement={{
        tag: 'mood-badge',
        shadow: 'none',
        props: {
            mood: {
                attribute: 'data-mood',
                type: 'String',
            },
        },
    }}
/>

<script lang="ts">
    interface Props {
        mood?: string | null;
    }

    let { mood }: Props = $props();

    const moodStyles: Record<string, string> = {
        tech: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
        personal: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
        politics: 'bg-red-500/15 text-red-400 border-red-500/30',
        tutorial: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        opinion: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        announcement: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        research: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        review: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    };

    const moodLabels: Record<string, string> = {
        tech: 'Technology',
        personal: 'Personal',
        politics: 'Politics',
        tutorial: 'Tutorial',
        opinion: 'Opinion',
        announcement: 'Announcement',
        research: 'Research',
        review: 'Review',
    };

    let classes = $derived(moodStyles[mood || ''] || moodStyles['tech']);
    let label = $derived(moodLabels[mood || ''] || mood?.toUpperCase() || 'Technology');
</script>

<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border {classes}">
    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
    {label}
</span>
