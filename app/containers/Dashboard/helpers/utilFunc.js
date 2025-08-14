export const roundToTwoIN = (value) => {
    return Number(value ?? 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


export function formatSelectedKeys(data) {
    const keysToFormat = [
        // 'qty',
        'priceChangePercent',
        'priceChange',
        'open',
        'ltp',
        'low',
        'high',
        'close',
        'bidRate',
        'askRate'
    ];
    // console.log('typeof data.bidRate', typeof data.bidRate);

    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (keysToFormat.includes(key)) {
                const numValue = Number(value);
                if (!isNaN(numValue) && isFinite(numValue)) {
                    return [key, roundToTwoIN(numValue)];
                }
                // return [key, roundToTwoIN(value)];
            }
            return [key, value];
        })
    );
}

export function formatScriptIds(script) {
    if (!Array.isArray(script) || script.length === 0) return '';
    return JSON.stringify(script.map(val => Number(val.id))).slice(1, -1);
}