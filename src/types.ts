export interface NamedGroup {
    [name: string]: any
}

export interface RegExResult {
    /**
     * The string that matched the Regular Expression
     * */
    match: string,
    /**
     * An array of values from capture groups in the Regular Expression. If a capture group did not match its value is undefined.
     * */
    groups: string[],
    /**
     * The zero-based index of the string tested where the matched regular expression began
     * */
    index: number
    /**
     * An object with (key => values) consisting of (named capture group name => capture group value)
     * */
    named: NamedGroup
}

export interface SearchAndReplaceRegExp {
    /**
     * The search value to test for
     *
     * Can be a normal string (converted to a case-sensitive literal) or a valid regular expression as a string, or an actual RegExp object
     *
     * EX `["find this string", "/some string*\/ig"]`
     *
     * @examples ["find this string", "/some string*\/ig"]
     * */
    search: string | RegExp

    /**
     * The replacement string/value to use when search is found
     *
     * This can be a literal string like `'replace with this`, an empty string to remove the search value (`''`), or a special regex value
     *
     * See replacement here for more information: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
     * */
    replace: string
}

export type LiteralSearchBehavior = 'startsWith' | 'endsWith' | 'contains' | 'exact';

export interface LiteralSearchOptions {
    /**
     * Trim whitespace from string value before transforming and escaping
     * */
    trim?: boolean

    /**
     * How the literal search value expression should be built IE how to search for the value in a string:
     *
     * * 'exact' => tested string must match the search value exactly
     * * 'contains' => search value must be present somewhere within the tested string
     * * 'startsWith' => search value must be present at the beginning of the tested string
     * * 'endsWith' => search value must be present at the end of the tested string
     * */
    behavior?: LiteralSearchBehavior

    /**
     * Default flags to set on the parsed regex or literal search expression
     * */
    flags?: string

    /**
     * One or more search-and-replace criteria used to transform the string value before using it as the literal search expression
     * */
    transform?: SearchAndReplaceRegExp | SearchAndReplaceRegExp[]
    /**
     * A search-and-replace criteria used to escape the string value before it is inserted into the literal search expression. A default escape function is provided.
     * */
    escapeTransform?: SearchAndReplaceRegExp
}
