export function normalizeProps(props: string) {
    if (props.toLowerCase() === 'none') {
        return null;
    }
    return props;
}
