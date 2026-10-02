export function formatMinecraftId(id: string): string {
    const cleanId = id.includes(':') ? id.split(':')[1] : id;
    return cleanId
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
