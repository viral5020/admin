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
    if (Array.isArray(script)) {
        return script.length > 0
            ? JSON.stringify(script.map(val => Number(val.id))).slice(1, -1)
            : '';
    }

    // If it's a single value, just return it
    return script ? script.id : '';
}

export function formatArrPayload(script) {
    if (Array.isArray(script)) {
        return script.length > 0
            ? JSON.stringify(script.map(val => Number(val))).slice(1, -1)
            : '';
    }

    // If it's a single value, just return it
    return script ? script : '';
}



export const forex_comex_market = [
    { market_type_name: "FOREX", text: "FOREX", value: "FOREX", market_type_id: "6", id: "6", selected: false },
    { market_type_name: "COMEX", text: "COMEX", value: "COMEX", market_type_id: "7", id: "7", selected: false }
]

export const MCXFUT_id = '1';

export function formatToTwoDecimals(str) {
    if (str === null || str === undefined || isNaN(str)) return str;
    return Number(str).toFixed(2);
}

export function humanize(str) {
    if (!str) return "";

    return str
        // insert space before capital letters (for camelCase)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        // replace hyphens/underscores with spaces
        .replace(/[-_]/g, " ")
        // trim spaces
        .trim()
        // capitalize first letter of each word
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getLastPath(path) {
    if (!path) return "";
    return path.split("/").filter(Boolean).pop();
}