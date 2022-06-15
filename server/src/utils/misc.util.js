const isPositiveInteger = (num) => {
    return !isNaN(num) && Number.isInteger(num) && num > 0;
}

const toPositiveInteger = (str) => {
    if (str instanceof String || typeof str !== 'string') {
        return null;
    }

    const num = Number(str);

    if (isPositiveInteger(num))
        return num;

    return null;
}

const isStringNotNullOrEmpty = (str) => {
    return str
        && (str instanceof String || typeof(str) === "string")
        && str.length > 0;
}

module.exports = { toPositiveInteger, isStringNotNullOrEmpty, isPositiveInteger }
