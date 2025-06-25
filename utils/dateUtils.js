export function shortDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
    })
}

export function ISODate(date) {
    return date.toLocaleDateString('fr-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

export function addDays(date, n) {
    return new Date(date + n * 24 * 60 * 60 * 1000)
}

export function toEpochDate(date) {
    if (!date) return
    const time = new Date(date).getTime();
    if (isNaN(time)) throw new Error('Invalid date');
    return time / (86400 * 1000);
}

export function fromEpochDate(n) {
    return ISODate(new Date(n * 86400 * 1000))
}