# @foxxmd/regex-buddy-core

[![Latest Release](https://img.shields.io/github/v/release/foxxmd/regex-buddy-core)](https://github.com/FoxxMD/regex-buddy-core)
[![NPM Version](https://img.shields.io/npm/v/%40foxxmd%2Fregex-buddy-core)](https://www.npmjs.com/package/@foxxmd/regex-buddy-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Javascript helper functions for handling [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) and parsing user input as Regular Expressions

[**Docs best viewed at foxxmd.github.io/regex-buddy-core**](https://foxxmd.github.io/regex-buddy-core)

# Why?

### Normalize All The Things

Are you tired of dealing with different results based on whether a Regex is [`global`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global0) or not? Do you hate having to deal with [`match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match), [`test`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test), [`matchAll`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll), and [`exec`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)?

Use regex-buddy's [`parseRegex`](#parseregex) with _any_ Regex object and get back:

* On no match => `undefined`
* On 1 or more matches (regardless of `global`) => an array of [`RegExResult`](#regexresult) objects that contain all the context you need.

### Expressionize All The Strings

Do you want to allow users to search/match strings? What about allowing users to search/match a string with Regular Expressions? But isn't that a headache??

Not anymore! With regex-buddy's [`parseToRegex`](#parsetoregex) and [`parseToRegexOrLiteralSearch`](#parsetoregexorliteralsearch), using the power of [`@stdlib/regexp-regexp`](https://github.com/stdlib-js/regexp/tree/main/regexp) under the hood, you can treat any search input as a regular expression and gracefully fallback to "dumb" searching. Always get a `RegExp` object back regardless of the input given!

# Install

```bash
npm install @foxxmd/regex-buddy-core
```

# Usage

## Functions

### `parseToRegex()`

Uses [`@stdlib/regexp-regexp`](https://github.com/stdlib-js/regexp/tree/main/regexp) to convert a regular [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) into a Regular Expression [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) object.

#### Args

* `val: string` - Value to convert EX `'/^my (reg)ular expression$/'`
* `defaultFlags?: string` - Optional [flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags) to add to the parsed expression, if none were found.

#### Example

```js
import {parseToRegex} from '@foxxmd/regex-buddy-core';

const myReg = parseToRegex('/my (reg)?ular expression/', 'i');
myReg.test('this string has my ReGuLaR expression in it'); // true

const myPlainStr = parseToRegex('just some plain string');
console.log(myPlainStr); //undefined
```

### `parseToRegexOrLiteralSearch()`

Tries to convert a regular string into a RegExp object using [`parseToRegex()`](#parsetoregex). If the string is not a valid regular expression then the string is [escaped](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping) and used as [character literals](https://www.regular-expressions.info/characters.html) to create a "dumb" expression that matches the string's value as-is. If the string cannot be converted to a valid expression an error is thrown.

#### Args

* `val: string` - Value to convert EX `'/^my (reg)ular expression$/'`
* `options?` - Can be either
  * An optional `string` of [flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags) to add to the parsed expression, if none were found.
  * A [`LiteralSearchOptions`](#literalsearchoptions) object used to customize the literal search expression generated.

#### Example

```js
import {parseToRegexOrLiteralSearch} from '@foxxmd/regex-buddy-core';

const strAsReg = parseToRegexOrLiteralSearch('/my (reg)?ular expression/', 'i');
strAsReg.test('this string has my ReGuLaR expression in it'); // true

const plainStr = parseToRegexOrLiteralSearch('exactStr', 'i'); // defaults to behavior: 'exact'
strAsReg.test('exactSTR'); // true

const containsStr = parseToRegexOrLiteralSearch('anywhere', {flags: 'i', behavior: 'contains'});
containsStr.test('has the keyword anywhere in the string'); // true

```

#### `parseToRegexOrLiteralSearchCached()`

A wrapped version of `parseToRegexOrLiteralSearch` that caches `RegExp` based on unique inputs of `val`, `options.behavior`, and default flags.

Provide either a max number of cached entries or provide your own implementation of `SimpleCache`.

### `parseRegex()`

Takes a [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) and string value to test and returns:

* If no matches => `undefined`
* If any matches => An array of [`RegExResult`](#regexresult)

`parseRegex` will handle the expression regardless of whether it is [`global`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global0) or not. If it is `global` then the returned array will contain all matches. If it is not global the returned array will only have one result.

#### Args

* `reg: RegExp` - Regular Expression object to test with
* `val: string` - The string to test on

#### Example

```js
import {parseRegex} from '@foxxmd/regex-buddy-core';

const normalRes = parseRegex(new RegExp(/my (reg)?ular (?<myGroup>exp)ression/i), 'this string has my ReGuLaR expression in it');
console.log(normalRes); // [ {...} ]
console.log(normalRes[0]);
// {
//     match: 'this string has my ReGuLaR expression in it',
//     index: 0,
//     groups: ['reg'],
//     named: {
//         myGroup: 'exp'
//     }
// }

const noRes = parseRegex(new RegExp(/my (reg)?ular (?<myGroup>exp)ression/i), 'it has no match');
console.log(noRes); // undefined

const globalRes = parseRegex(new RegExp(/all matches/g), 'this has all matches because it globally has all matches');
console.log(globalRes);
// [
//     {
//         match: 'this has all matches because it globally has all matches',
//         index: 9,
//         groups: [],
//         named: {}
//     },
//     {
//         match: 'this has all matches because it globally has all matches',
//         index: 45,
//         groups: [],
//         named: {}
//     }
// ]

```

### `parseRegexSingle()`

A convenience function for dealing with non-global expressions. The same as `parseRegex()` except:

* throw an error if more than one match (does not allow `global`)
* return result is either `undefined` or `RegexResult` (not an array)

#### Example

```js
import {parseRegexSingle} from '@foxxmd/regex-buddy-core';

const normalRes = parseRegexSingle(new RegExp(/my (reg)?ular (?<myGroup>exp)ression/i), 'this string has my ReGuLaR expression in it');
console.log(normalRes);
// {
//     match: 'this string has my ReGuLaR expression in it',
//     index: 0,
//     groups: ['reg'],
//     named: {
//         myGroup: 'exp'
//     }
// }

const noRes = parseRegexSingle(new RegExp(/my (reg)?ular (?<myGroup>exp)ression/i), 'it has no match');
console.log(noRes); // undefined

const globalRes = parseRegexSingle(new RegExp(/all matches/g), 'this has all matches because it globally has all matches'); // THROWS AN ERROR

```

### `testMaybeRegex()`

A convenience function that parses a string using `parseToRegexOrLiteralSearch()`, tests it against a value, and returns a tuple of:

* `boolean` Whether a match was found
* `string` The (first) matched string

#### Args

* `test: string` - Value to convert to an expression
* `subject: string` - The string to test on
* `options?` - Can be either
  * An optional `string` of [flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags) to add to the parsed expression, if none were found.
  * A [`LiteralSearchOptions`](#literalsearchoptions) object used to customize the literal search expression generated.
    * If `behavior` is not defined then `contains` is used.

#### Example

```js
import {testMaybeRegex} from '@foxxmd/regex-buddy-core';

const result = testMaybeRegex('/my (reg)?ular expression/', 'this string has my ReGuLaR expression in it');
console.log(result); // [true, 'my ReGuLaR expression']

const noMatch = testMaybeRegex(new RegExp(/my (reg)?ular (?<myGroup>exp)ression/i), 'it has no match');
console.log(noMatch); // undefined

```

### `searchAndReplace()`

Perform one or more search-and-replace functions on a string by providing [`SearchAndReplaceRegExp`](#searchandreplaceregexpr) criteria. This is very similar to [String.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) except that:

* it can accept multiple search-and-replace operations that are performed on the resulting value of each previous operation
* the `search` value can be a `RegExp` object, or a string that that is converted using [`parseToRegexOrLiteralSearch()`](#parsetoregexorliteralsearch))

#### Args

* `val?: string` - String to perform operations on
* `ops: SearchAndReplaceRegExp[]` - One or more search-and-replace criteria to use for the operations.
* `options?` - Optional, how to convert `search` string values to literal searches. Can be either
  * An optional `string` of [flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags) to add to the parsed expression, if none were found.
  * A [`LiteralSearchOptions`](#literalsearchoptions) object used to customize the literal search expression generated.
    * If `behavior` is not defined then `contains` is used.

#### Example

```js
import {searchAndReplace} from '@foxxmd/regex-buddy-core';

const ops = [
  {
      search: '/remove (this)/',
      replace: ''
  },
  {
      search: '/TEST/ig',
      replace: 'DOUBLETEST'
  }
];

const result = searchAndReplace('this is a TeSt which will remove this TEST', ops);
console.log(result); // this is a DOUBLETEST which will remove DOUBLETEST
```

## Interfaces

### `LiteralSearchOptions`

An object that defines how a string is handled prior to usage as a literal string expression as well as how to search for the literal string.

* `flags?: string` - Optional [flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags) to add to the parsed literal search expression
* `trim?: boolean` - Trim whitespace from string value before transforming and escaping
* `transform?: (SearchAndReplaceRegExp | SearchAndReplaceRegExp[]) ` - One or more search-and-replace criteria used to transform the string value before using it as the literal search expression
* `escapeTransform?: SearchAndReplaceRegExp` - A search-and-replace criteria used to escape the string value before it is inserted into the literal search expression. This operation is run _after_ any `transform` operations. A [default escape function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping) is provided.
* `behavior?: string` - How the literal search value expression should be built IE how to search for the value in a string:
  * `exact` => tested string must match the search value exactly
  * `contains` => search value must be present somewhere within the tested string
  * `startsWith` => search value must be present at the beginning of the tested string
  * `endsWith` => search value must be present at the end of the tested string

### `SearchAndReplaceRegExp`

Criteria used to perform a search-and-replace operation on a string. This is very similar to [String.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) except that `string` value used for `search` will be converted to RegExp first using [`parseToRegexOrLiteralSearch()`](#parsetoregexorliteralsearch).

* `search:  (string | RegExp)` - The search value to test for. Can be a normal string (converted to a case-sensitive literal) or a valid regular expression as a string, or an actual RegExp object.
* `replace: string` - The replacement string/value to use when search is found. This can be a literal string like `'replace with this'`, an empty string to remove the search value (`''`), or a [special regex value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement).

### `RegExResult`

A normalized regular expression match.

* `match: string` - The subset of the string that matched the expression
* `index: number` - The zero-based index of the string where the matched expression began
* `groups: (string|undefined)[]` - An array of values from capture groups in the expression. If a capture group did not match its value is undefined.
* `named: { [string]: string }` - An object with (key => values) consisting of (named capture group name => capture group value)

## License

MIT
