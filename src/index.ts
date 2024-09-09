import {
    parseRegex,
    parseToRegex,
    parseToRegexOrLiteralSearch,
    parseToRegexOrLiteralSearchCached,
    parseRegexSingle,
    searchAndReplace,
    searchAndReplaceCached,
    testMaybeRegex,
    testMaybeRegexCached,
    isRegExResult,
    cacheFunctions,
} from './funcs.js';
import {
    LiteralSearchBehavior,
    LiteralSearchOptions,
    LiteralSearchOptionsOrFlag,
    RegExResult,
    SearchAndReplaceRegExp,
    NamedGroup,
    SimpleCache,
    CacheOption
} from './types.js';

export {
    isRegExResult,
    parseToRegex,
    parseToRegexOrLiteralSearch,
    parseToRegexOrLiteralSearchCached,
    parseRegex,
    parseRegexSingle,
    searchAndReplace,
    searchAndReplaceCached,
    testMaybeRegex,
    testMaybeRegexCached,
    cacheFunctions
}

export type {
    LiteralSearchOptions,
    LiteralSearchBehavior,
    LiteralSearchOptionsOrFlag,
    RegExResult,
    SearchAndReplaceRegExp,
    NamedGroup,
    CacheOption,
    SimpleCache
}
