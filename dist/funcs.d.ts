import { LiteralSearchBehavior, LiteralSearchOptions, RegExResult, SearchAndReplaceRegExp } from "./types.js";
export declare const literalSearchBehaviors: LiteralSearchBehavior[];
/**
 * Tries to parse a string as a regular expression
 *
 * @param {string} val The string to parse
 * @param {string} [defaultFlags] Flags to set on the parsed Regular Expression if it does not have its own
 * */
export declare const parseToRegex: (val: string, defaultFlags?: string) => RegExp | undefined;
/**
 * Tries to parse a string as a regular expression. If this fails it tries to convert the string into a Regular Expression with a literal search for the string value.
 *
 * @param {string} val The string to parse
 * @param {(string|LiteralSearchOptions)} [options] Options related to how to parse the string value for the literal search
 * */
export declare const parseToRegexOrLiteralSearch: (val: string, options?: string | LiteralSearchOptions) => RegExp;
/**
 * Tests a value against a given regular expression and returns a list of normalized results.
 *
 * @param {RegExp} reg The regular expression to use
 * @param {string} val The string to test with the regular expression
 * */
export declare const parseRegex: (reg: RegExp, val: string) => RegExResult[] | undefined;
/**
 * Tests a value against a regular expression and returns a result if only one result is found.
 *
 * * If the expression does not match undefined is returned
 * * If the expression uses global 'g' flag and more than one result is found an error is thrown
 *
 * @param {RegExp} reg The regular expression to use
 * @param {string} val The string to test with the regular expression
 * */
export declare const parseRegexSingle: (reg: RegExp, val: string) => RegExResult | undefined;
/**
 * Tries to parse a string as a regular expression, falling back to literal search, and then tests a given value
 *
 * Returns a tuple of [matchedExpressionBool,matchedValString]
 *
 * @param {string} test The string to use a regular expression
 * @param {string} subject The string to test with the regular expression
 * @param {(string|LiteralSearchOptions)} [options] Options related to how to parse the string value for the literal search
 * */
export declare const testMaybeRegex: (test: string, subject: string, options?: string | LiteralSearchOptions) => [boolean, string];
/**
 * Perform one or more search-and-replace operations on a string where the 'search' value may be a regular expression, a string to parse as a regular expression, or a string to use as a literal search expression
 *
 * @param {string} val The string to perform search-and-replace operations on
 * @param {SearchAndReplaceRegExp[]} ops An array of search-and-replace criteria
 * @param {(string|LiteralSearchOptions)} [options] Options related to how to parse the string value for the literal search
 * */
export declare const searchAndReplace: (val: string, ops: SearchAndReplaceRegExp[], options?: string | LiteralSearchOptions) => string;
