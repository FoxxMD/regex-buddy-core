# regex-buddy-core

Javascript helper functions for handling [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) and parsing user input as Regular Expressions

## Why?

### Normalize All The Things

Are you tired of dealing with different results based on whether a Regex is `global` or not? Do you hate having to deal with `match`, `test`, `matchAll`, and `exec`?

Use regex-buddy's `parseRegex` with _any_ Regex object and get back:

* On no match => `undefined`
* On 1 or more matches (regardless of `global`) => an array of `RegExResult` objects that contain all the context you need.

### Expressionize All The Strings

Do you want to allow users to search/match strings? What about allowing users to search/match a string with Regular Expressions? But isn't that a headache??

Not anymore! With regex-buddy's `parseToRegex` and `parseToRegexOrLiteralSearch`, using the power of [`@stdlib/regexp-regexp`](https://github.com/stdlib-js/regexp/tree/main/regexp) under the hood, you can treat any search input as a regular expression and gracefully fallback to "dumb" searching. Always get a `RegExp` object back regardless of the input given!

## Install

```bash
npm install @foxxmd/regex-buddy-core
```

## Usage


## License

MIT
