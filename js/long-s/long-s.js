function getConversionFunc(lang) {
    /** Returns the conversion function used for a particular language. */
    const enFn = typeof convertEnglishWord !== 'undefined' ? convertEnglishWord : (typeof globalThis !== 'undefined' ? globalThis.convertEnglishWord : null);
    const frFn = typeof convertFrenchWord !== 'undefined' ? convertFrenchWord : (typeof globalThis !== 'undefined' ? globalThis.convertFrenchWord : null);
    const deFn = typeof convertGermanWord !== 'undefined' ? convertGermanWord : (typeof globalThis !== 'undefined' ? globalThis.convertGermanWord : null);
    const esFn = typeof convertSpanishWord !== 'undefined' ? convertSpanishWord : (typeof globalThis !== 'undefined' ? globalThis.convertSpanishWord : null);
    const itFn = typeof convertItalianWord !== 'undefined' ? convertItalianWord : (typeof globalThis !== 'undefined' ? globalThis.convertItalianWord : null);

    switch (lang) {
        case "en":
            return enFn;
        case "fr":
            return frFn;
        case "de":
            return deFn;
        case "es":
            return esFn;
        case "it":
            return itFn;
        default:
            return null;
    }
}


function convertText(text, langOption = "en", keepUnknownS = false) {
    /**
    Places the long s (ſ) in a sentence and returns it.
     
    Parameters:
    text (string): the string to convert into archaic spelling.
    langOption (string): the language code for <text>. "en", "es", "fr", "it", or "de".
    keepUnknownS (boolean): if true, ambiguous cases of S will be shown as X.
     
    Returns:
    string: text with the long s (ſ) placed.
    */
    if (!text) return "";
    const convertFunc = getConversionFunc(langOption);

    if (convertFunc === null) {
        console.warn(`language "${langOption}" not found. The options are: en, es, fr, it, de.`);
        return text;
    }

    const splitFn = typeof _splitStringWithIndices !== 'undefined' ? _splitStringWithIndices : (typeof globalThis !== 'undefined' ? globalThis._splitStringWithIndices : null);
    if (!splitFn) return text;

    const wordsWithIndices = splitFn(text, langOption);

    // converts each word individually.
    for (const [oldWord, startIndex] of wordsWithIndices) {
        const newWord = convertFunc(oldWord, keepUnknownS);

        if (oldWord !== newWord) {
            text = text.slice(0, startIndex) + newWord + text.slice(startIndex + oldWord.length);
        }
    }

    return text;
}

if (typeof globalThis !== 'undefined') {
    globalThis.getConversionFunc = getConversionFunc;
    globalThis.convertText = convertText;
    globalThis.convertLongS = convertText;
    globalThis.LongS = {
        convertText,
        convertLongS: convertText,
        getConversionFunc,
        convertEnglishWord: typeof convertEnglishWord !== 'undefined' ? convertEnglishWord : (typeof globalThis !== 'undefined' ? globalThis.convertEnglishWord : null),
        convertFrenchWord: typeof convertFrenchWord !== 'undefined' ? convertFrenchWord : (typeof globalThis !== 'undefined' ? globalThis.convertFrenchWord : null),
        convertGermanWord: typeof convertGermanWord !== 'undefined' ? convertGermanWord : (typeof globalThis !== 'undefined' ? globalThis.convertGermanWord : null),
        convertSpanishWord: typeof convertSpanishWord !== 'undefined' ? convertSpanishWord : (typeof globalThis !== 'undefined' ? globalThis.convertSpanishWord : null),
        convertItalianWord: typeof convertItalianWord !== 'undefined' ? convertItalianWord : (typeof globalThis !== 'undefined' ? globalThis.convertItalianWord : null),
        splitStringWithIndices: typeof _splitStringWithIndices !== 'undefined' ? _splitStringWithIndices : (typeof globalThis !== 'undefined' ? globalThis._splitStringWithIndices : null)
    };
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getConversionFunc,
        convertText,
        convertLongS: convertText,
        convertEnglishWord: typeof convertEnglishWord !== 'undefined' ? convertEnglishWord : null,
        convertFrenchWord: typeof convertFrenchWord !== 'undefined' ? convertFrenchWord : null,
        convertGermanWord: typeof convertGermanWord !== 'undefined' ? convertGermanWord : null,
        convertSpanishWord: typeof convertSpanishWord !== 'undefined' ? convertSpanishWord : null,
        convertItalianWord: typeof convertItalianWord !== 'undefined' ? convertItalianWord : null,
        splitStringWithIndices: typeof _splitStringWithIndices !== 'undefined' ? _splitStringWithIndices : null
    };
}