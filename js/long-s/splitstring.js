function _isLetter(char) {
    /** Returns true if the given character is a letter. */
    const category = char.codePointAt(0);
    return (category >= 0x0041 && category <= 0x005A) || // A-Z.
        (category >= 0x0061 && category <= 0x007A) || // a-z.
        (category >= 0x00C0 && category <= 0x00FF); // accented letters (Lat-1).
}


function _splitStringWithIndices(inputString, lang) {
    /**
    This function takes the given text and splits it into a list of words,
    with each word having its index in the original text provided.
    the function also considers language-specific rules for word splitting.

    Parameters:
    text (string): the string to be split.
    lang (string): the language code (to handle specific rules).

    Returns:
    list of tuples: each tuple contains the original text itself
                    and the index where it starts in the source text.
    */

    const APOSTROPHES = "'";
    const results = [];
    const regex = /\S+/g; // matches non-whitespace sequences.

    // uses regex to find all matches in the input string.
    let match;
    while ((match = regex.exec(inputString)) !== null) {
        let index = match.index;
        let word = match[0];

        // finds the first letter of the word.
        let localStartIndex = 0;
        for (let i = 0; i < word.length; i++) {
            if (_isLetter(word[i])) {
                localStartIndex = i;
                break;
            }
        }

        if (localStartIndex === word.length) continue; // no letters found.

        let localEndIndex = word.length - 1;
        if (lang === "de") {
            // if German, it considers apostrophes for ending index.
            for (let i = word.length - 1; i >= 0; i--) {
                if (_isLetter(word[i]) || word[i] === APOSTROPHES) {
                    localEndIndex = i;
                    break;
                }
            }
        } else {
            // for other languages, it only considers letters for ending index.
            for (let i = word.length - 1; i >= 0; i--) {
                if (_isLetter(word[i])) {
                    localEndIndex = i;
                    break;
                }
            }
        }

        index += localStartIndex;
        word = word.substring(localStartIndex, localEndIndex + 1);
        results.push([word, index]);
    }

    return results;
}

if (typeof globalThis !== 'undefined') {
    globalThis._isLetter = _isLetter;
    globalThis._splitStringWithIndices = _splitStringWithIndices;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { _isLetter, _splitStringWithIndices };
}
