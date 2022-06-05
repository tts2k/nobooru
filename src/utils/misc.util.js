const toPositiveInteger = (str) => {
    if (typeof str !== 'string') {
        return null;
    }

    const num = Number(str);

    if (Number.isInteger(num) && num > 0)
        return num;

    return null;
}

module.exports = { toPositiveInteger }
