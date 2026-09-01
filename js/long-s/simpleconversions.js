function _stripAccents(str) {
    /** Returns the given text with any accents removed. */
    const accents = {
        'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'å': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o', 'ø': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c',
        'ñ': 'n'
    };
    return str.split('').map(char => accents[char] || char).join('');
}


function _stripConsonantAccents(word) {
    /** Returns text with any accent marks over only consonants removed. */
    let result = "";
    const noAccents = _stripAccents(word);
    for (let i = 0; i < noAccents.length; i++) {
        const nChar = noAccents[i];
        if ("AEIOUYaeiouy".includes(nChar)) {
            result += word[i];
        } else {
            result += nChar;
        }
    }
    return result;
}


function _applyLongSPattern(word, pattern) {
    /**
    Returns the result of using the given regex pattern
    to select occurrences of the letter S and replace them with a long S.
    returns null if no replacements are made.
    */
    const regex = new RegExp(pattern, 'g');
    const indices = [...word.matchAll(regex)].map(m => m.index);

    if (indices.length === 0) {
        return null;  // there are no replacements to be made.
    }

    // makes replacements at the identified locations.
    for (const index of indices) {
        word = word.slice(0, index) + "ſ" + word.slice(index + 1);
    }
    return word;
}


function _transferLongS(processedWord, originalWord) {
    /**
    This function is given the processed word with any long S (ſ),
    which will generally lack accents and capitalization,
    and transfer any long S to the given original word,
    so that the capitalization and accents of the original text
    are ultimately maintained.
    */
    if (processedWord.length !== originalWord.length) {
        return processedWord;
    }

    for (let i = 0; i < processedWord.length; i++) {
        const pChar = processedWord[i];
        const oChar = originalWord[i];
        if (oChar === "s") {
            originalWord = originalWord.slice(0, i) + pChar + originalWord.slice(i + 1);
        }
    }
    return originalWord;
}


function convertEnglishWord(word) {
    /** Returns English text with the long S (ſ) placed appropriately. */
    const noAccents = _stripAccents(word.toLowerCase());

    // looks for any "S" that's followed by a line break (but not a hyphen)
    // or a letter other than F, B (old books only), K (old books only),
    // and is also NOT preceded by the letter F.
    const SHORT_BEFORE_B_AND_K = false;  // historical variation.

    let pattern;
    if (SHORT_BEFORE_B_AND_K) {
        pattern = /(?<!f)s(?=[ac-eg-jl-z—])/;
    } else {
        pattern = /(?<!f)s(?=[a-eg-z—])/;
    }

    const modifiedWord = _applyLongSPattern(noAccents, pattern);
    if (modifiedWord === null) {
        return word;  // there are no replacements to be made.
    }

    const finalWord = modifiedWord.replace(/ſſſ/g, "ſsſ");
    return _transferLongS(finalWord, word);
}


function convertFrenchWord(word) {
    /** Returns French text with the long S (ſ) placed appropriately. */
    const noAccents = _stripAccents(word.toLowerCase());

    // looks for any "S" that's followed by a letter other than B, F, or H.
    const modifiedWord = _applyLongSPattern(noAccents, /s(?=[ac-egi-z])/);
    if (modifiedWord === null) {
        return word;  // there are no replacements to be made.
    }
    return _transferLongS(modifiedWord, word);
}


function convertSpanishWord(word) {
    /** Returns Spanish text with the long S (ſ) placed appropriately. */
    const cleanWord = _stripConsonantAccents(word.toLowerCase());

    // looks for any "S" that's followed by a letter other than B, F, H,
    // or an accented vowel. it can also be followed by a hyphen or line-break.
    const modifiedWord = _applyLongSPattern(cleanWord, /s(?=[ac-egi-z-—])/);
    if (modifiedWord === null) {
        return word;  // there are no replacements to be made.
    }

    const finalWord = modifiedWord.replace(/ſſi/g, "ſsi");
    return _transferLongS(finalWord, word);
}


function convertItalianWord(word) {
    /** Returns Italian text with the long S (ſ) placed appropriately. */
    const MAINTAIN_DOUBLE_LONG_WITH_SSI = true;  // historical variation.
    const cleanWord = _stripConsonantAccents(word.toLowerCase());

    // looks for any "S" that's followed by a letter other than B, F,
    // or an accented vowel.
    const modifiedWord = _applyLongSPattern(cleanWord, /s(?=[ac-eg-z-—])/);
    if (modifiedWord === null) {
        return word;  // there are no replacements to be made.
    }

    const finalWord = MAINTAIN_DOUBLE_LONG_WITH_SSI ? modifiedWord : modifiedWord.replace(/ſſi/g, "ſsi");
    return _transferLongS(finalWord, word);
}

if (typeof globalThis !== 'undefined') {
    globalThis._stripAccents = _stripAccents;
    globalThis._stripConsonantAccents = _stripConsonantAccents;
    globalThis._applyLongSPattern = _applyLongSPattern;
    globalThis._transferLongS = _transferLongS;
    globalThis.convertEnglishWord = convertEnglishWord;
    globalThis.convertFrenchWord = convertFrenchWord;
    globalThis.convertSpanishWord = convertSpanishWord;
    globalThis.convertItalianWord = convertItalianWord;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        _stripAccents,
        _stripConsonantAccents,
        _applyLongSPattern,
        _transferLongS,
        convertEnglishWord,
        convertFrenchWord,
        convertSpanishWord,
        convertItalianWord
    };
}


