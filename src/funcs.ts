import reRegExp from '@stdlib/regexp-regexp';
import { LRUMap } from "ts_lru_map";
import {
    CacheOption,
    LiteralSearchBehavior,
    LiteralSearchOptions,
    RegExResult,
    SearchAndReplaceRegExp, SimpleCache
} from "./types.js";

const ReReg = reRegExp();

const ESCAPE_SEARCH = new RegExp(/[-\/\\^$*+?.()|[\]{}]/g);
const ESCAPE_REPLACE = '\\$&';

export const literalSearchBehaviors: LiteralSearchBehavior[] = ['startsWith', 'endsWith', 'contains', 'exact'];

const asLiteralSearchBehavior = (val: string): val is LiteralSearchBehavior => {
    return literalSearchBehaviors.includes(<"startsWith" | "endsWith" | "contains" | "exact">val);
}
/**
 * Tries to parse a string as a regular expression
 *
 * @param {string} val The string to parse
 * @param {string} [defaultFlags] Flags to set on the parsed Regular Expression if it does not have its own
 * */
export const parseToRegex = (val: string, defaultFlags?: string): RegExp | undefined => {

    const result = ReReg.exec(val);
    if (result !== null) {
        // index 0 => full string
        // index 1 => regex without flags and forward slashes
        // index 2 => flags
        const flags = result[2] === '' ? (defaultFlags || '') : result[2];
        return new RegExp(result[1], flags);
    }

    return undefined;
};

/**
 * Tries to parse a string as a regular expression. If this fails it tries to convert the string into a Regular Expression with a literal search for the string value.
 *
 * @param {string} val The string to parse
 * @param {(string|LiteralSearchOptions)} [options] Options related to how to parse the string value for the literal search
 * */
export const parseToRegexOrLiteralSearch = (val: string, options: string | LiteralSearchOptions = {}): RegExp => {

    const realOpts = typeof options === 'string' ? {flags: options} : options;
    const {
        trim = false,
        flags,
        behavior: behaviorVal = 'exact',
        transform: transformVal = [],
        escapeTransform = {search: ESCAPE_SEARCH, replace: ESCAPE_REPLACE}
    } = realOpts;

    const defaultFlags = flags;

    let reg: RegExp | undefined;

    reg = realOpts.cache?.get(`${val}${defaultFlags ?? ''}`);
    if(reg !== undefined) {
        return reg;
    }

    reg = parseToRegex(val, flags);

    if (reg !== undefined) {
        realOpts.cache?.set(`${val}${defaultFlags ?? ''}`, reg);
        return reg;
    }

    if (!asLiteralSearchBehavior(behaviorVal)) {
        throw new Error(`The given behavior '${behaviorVal}' when parsing string ${val} is not valid, must be one of: ${literalSearchBehaviors.join(', ')}`);
    }
    const behavior: LiteralSearchBehavior = behaviorVal;

    const transformVals = Array.isArray(transformVal) ? transformVal : [transformVal];
    const transform: SearchAndReplaceRegExp[] = transformVals as SearchAndReplaceRegExp[];

    const cleanVal = searchAndReplace(trim ? val.trim() : val, transform.concat(escapeTransform));

    switch (behavior) {
        case 'startsWith':
            reg = parseToRegex(`/^${cleanVal}/${defaultFlags ?? ''}`);
            break;
        case 'endsWith':
            reg = parseToRegex(`/${cleanVal}$/${defaultFlags ?? ''}`);
            break;
        case 'contains':
            reg = parseToRegex(`/${cleanVal}/${defaultFlags ?? ''}`);
            break;
        case 'exact':
            reg = parseToRegex(`/^${cleanVal}$/${defaultFlags ?? ''}`);
            break;
    }
    if (reg === undefined) {
        throw new Error(`Could not convert test value to a valid regex: ${val}`);
    }
    realOpts.cache?.set(`${val}${defaultFlags ?? ''}${behavior}`, reg);
    return reg;
}

const asSimpleCache = (val: unknown): val is SimpleCache => {
    return val !== null && typeof val === 'object' && 'set' in val && 'get' in val;
}

/**
 * A wrapped version of parseToRegexOrLiteralSearch that caches RegExp's based on inputs of RegExp string + behavior + default flags
 * */
export const parseToRegexOrLiteralSearchCached = (option: CacheOption)  => {
    let cache: SimpleCache;
    if(typeof option === 'number') {
        cache = new LRUMap<string, RegExp>(option);
    } else if(asSimpleCache(option)) {
        cache = option;
    }
    return (...args: Parameters<typeof parseToRegexOrLiteralSearch>) => {
        let opts: LiteralSearchOptions;
        const maybeOpts = args[1] ?? {};
        if(typeof maybeOpts === 'string') {
            opts = {flags: maybeOpts};
        }
        return parseToRegexOrLiteralSearch(args[0], {...opts, cache});
    };
}

/**
 * Tests a value against a given regular expression and returns a list of normalized results.
 *
 * @param {RegExp} reg The regular expression to use
 * @param {string} val The string to test with the regular expression
 * */
export const parseRegex = (reg: RegExp, val: string): RegExResult[] | undefined => {

    if (reg.global) {
        const g = Array.from(val.matchAll(reg));
        if (g.length === 0) {
            return undefined;
        }
        return g.map(x => {
            return {
                match: x[0],
                index: x.index,
                groups: x.slice(1),
                named: x.groups || {},
            } as RegExResult;
        });
    }

    const m = val.match(reg)
    if (m === null) {
        return undefined;
    }
    return [{
        match: m[0],
        index: m.index as number,
        groups: m.slice(1),
        named: m.groups || {}
    }];
}

/**
 * Tests a value against a regular expression and returns a result if only one result is found.
 *
 * * If the expression does not match undefined is returned
 * * If the expression uses global 'g' flag and more than one result is found an error is thrown
 *
 * @param {RegExp} reg The regular expression to use
 * @param {string} val The string to test with the regular expression
 * */
export const parseRegexSingle = (reg: RegExp, val: string): RegExResult | undefined => {
    const results = parseRegex(reg, val);
    if (results !== undefined) {
        if (results.length > 1) {
            throw new Error(`Expected Regex to match once but got ${results.length} results. Either Regex must NOT be global (using 'g' flag) or parsed value must only match regex once. Given: ${val} || Regex: ${reg.toString()}`);
        }
        return results[0];
    }
    return undefined;
}

/**
 * Tries to parse a string as a regular expression, falling back to literal search, and then tests a given value
 *
 * Returns a tuple of [matchedExpressionBool,matchedValString]
 *
 * @param {string} test The string to use a regular expression
 * @param {string} subject The string to test with the regular expression
 * @param {(string|LiteralSearchOptions)} [options] Options related to how to parse the string value for the literal search
 * */
export const testMaybeRegex = (test: string, subject: string, options: string | LiteralSearchOptions = {
    flags: 'i',
    behavior: 'contains'
}): [boolean, string] => {
    let reg = parseToRegexOrLiteralSearch(test, options);
    return [reg.test(subject), reg.toString()];
}

/**
 * Perform one or more search-and-replace operations on a string where the 'search' value may be a regular expression, a string to parse as a regular expression, or a string to use as a literal search expression
 *
 * @param {string} val The string to perform search-and-replace operations on
 * @param {SearchAndReplaceRegExp[]} ops An array of search-and-replace criteria
 * @param {(string|LiteralSearchOptions)} [options] Options related to how to parse the string value for the literal search
 * */
export const searchAndReplace = (val: string, ops: SearchAndReplaceRegExp[], options: string | LiteralSearchOptions = {
    flags: 'ig',
    behavior: 'contains'
}): string => {
    if (ops.length === 0) {
        return val;
    }
    return ops.reduce((acc, curr) => {
        let reg = curr.search instanceof RegExp ? curr.search : parseToRegexOrLiteralSearch(curr.search, options);
        return acc.replace(reg ?? val, curr.replace);
    }, val);
}

export const isRegExResult = (val: any): val is RegExResult => {
    if (val === undefined || val === null || typeof val !== 'object') {
        return false;
    }
    return ('match' in val && typeof val.match === 'string')
        && ('groups' in val && Array.isArray(val.groups))
        && ('named' in val && typeof val.named === 'object')
        && ('index' in val && typeof val.index === 'number');
}
