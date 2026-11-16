import AOS from '$lib/blocks/AOS';
import EmojiText from '$lib/blocks/EmojiText';
import type { ImageBlock, InlineImageBlock } from '$lib/types';

interface Props {
    block: ImageBlock | InlineImageBlock;
    inline?: boolean;
}

export default function ImageBlock({ block, inline = false }: Props) {
    const image = block.type === 'inline_image' ? block.value.image : block.value;
    const caption = block.type === 'inline_image' ? block.value.caption : '';

    if (!image.url) return null;
    return (
        <figure className={inline ? 'my-6' : 'my-10'}>
            <AOS animation="fade-up">
                <div className="overflow-hidden rounded-xl border border-dotted border-border/50">
                    <img src={image.url} alt={image.alt} loading="lazy" className="w-full" />
                </div>
            </AOS>
            {caption && <figcaption className="mt-3 text-center text-sm text-foreground/50"><EmojiText html={caption} /></figcaption>}
        </figure>
    );
}
