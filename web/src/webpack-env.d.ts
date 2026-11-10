/// <reference types="webpack-env" />

declare module '*.svg' {
    const content: import('react').ComponentType<
        import('react').SVGProps<SVGSVGElement>
    >;
    export default content;
}
