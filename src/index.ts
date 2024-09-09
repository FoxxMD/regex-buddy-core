import {parseRegex, parseToRegex, parseToRegexOrLiteralSearch, parseToRegexOrLiteralSearchCached, parseRegexSingle, searchAndReplace, testMaybeRegex, isRegExResult} from './funcs.js';
import {LiteralSearchBehavior, LiteralSearchOptions, RegExResult, SearchAndReplaceRegExp, NamedGroup, SimpleCache, CacheOption} from './types.js';

export {
    isRegExResult,
    parseToRegex,
    parseToRegexOrLiteralSearch,
    parseToRegexOrLiteralSearchCached,
    parseRegex,
    parseRegexSingle,
    searchAndReplace,
    testMaybeRegex,
}

export type {
    LiteralSearchOptions,
    LiteralSearchBehavior,
    RegExResult,
    SearchAndReplaceRegExp,
    NamedGroup,
    CacheOption,
    SimpleCache
}
