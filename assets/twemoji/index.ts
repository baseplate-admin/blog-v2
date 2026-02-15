import twemoji from 'twemoji';

const base = import.meta.env.BASE_URL;

// Native emoji–like CSS
const style = document.createElement('style');
style.textContent = `
	img.emoji {
		width: 1em;
		height: 1em;
		display: inline-block;
		vertical-align: -0.1em;
		pointer-events: none;
	}
`;
document.head.appendChild(style);

twemoji.parse(document.body, {
    folder: 'svg',
    ext: '.svg',
    base: `${base}twemoji/`,
});
