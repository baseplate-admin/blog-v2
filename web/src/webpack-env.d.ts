/// <reference types="webpack-env" />

declare module '*.svg' {
    const content: import('react').ComponentType<
        import('react').SVGProps<SVGSVGElement>
    >;
    export default content;
}

// Side-effect CSS imports (style-loader injects at runtime; no module shape).
declare module '*.css';
