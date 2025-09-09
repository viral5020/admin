export function safeParse(key) {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw || raw === 'undefined') return null; // safe guard
        return JSON.parse(raw);
    } catch (err) {
        console.warn(`Failed to parse sessionStorage key "${key}":`, err);
        return null;
    }
}
