import {parseRegex, parseToRegex, parseToRegexOrLiteralSearch, parseRegexSingle, searchAndReplace, testMaybeRegex, isRegExResult} from './funcs.js';
import {LiteralSearchBehavior, LiteralSearchOptions, RegExResult, SearchAndReplaceRegExp} from './types.js';

export {
    isRegExResult,
    parseToRegex,
    parseToRegexOrLiteralSearch,
    parseRegex,
    parseRegexSingle,
    searchAndReplace,
    testMaybeRegex,
}

export type {
    LiteralSearchOptions,
    LiteralSearchBehavior,
    RegExResult,
    SearchAndReplaceRegExp
}
