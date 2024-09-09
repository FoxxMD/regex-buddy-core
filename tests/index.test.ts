import { describe } from "mocha";
import chai, { expect } from "chai";
import {
    isRegExResult,
    parseRegexSingle,
    parseToRegexOrLiteralSearchCached,
    searchAndReplace,
    testMaybeRegex
} from "../src/funcs.js";
import { LiteralSearchBehavior, parseRegex, parseToRegex, parseToRegexOrLiteralSearch } from "../src/index.js";

describe('String to Regex', function () {
    it('Parses a valid regex string to RegEx', function () {
        const reg = parseToRegex('/my (reg)?ular expression/');
        expect(reg).is.not.undefined;
        expect(reg.toString()).is.eq('/my (reg)?ular expression/')
    });

    it('Parses an invalid string undefined', function () {
        const reg = parseToRegex('fsdfd');
        expect(reg).is.undefined;
    });

    it('Parses flags from string regex', function () {
        const reg = parseToRegex('/my (reg)?ular expression/i');
        expect(reg).is.not.undefined;
        expect(reg.toString()).is.eq('/my (reg)?ular expression/i')
    });

    it('Adds defaults flags from argument', function () {
        const reg = parseToRegex('/my (reg)?ular expression/', 'i');
        expect(reg).is.not.undefined;
        expect(reg.toString()).is.eq('/my (reg)?ular expression/i')
    });

    it('Does not override flags from string regex with defaults from argument', function () {
        const reg = parseToRegex('/my (reg)?ular expression/g', 'i');
        expect(reg).is.not.undefined;
        expect(reg.toString()).is.eq('/my (reg)?ular expression/g')
    });
});

describe('String to Literal or Regex', function () {

    it('Parses a valid regex string to RegEx', function () {
        const reg = parseToRegexOrLiteralSearch('/my (reg)?ular expression/');
        expect(reg).is.not.undefined;
        expect(reg.toString()).is.eq('/my (reg)?ular expression/')
    });

    it('Parses an invalid string to a regex literal', function () {
        const reg = parseToRegexOrLiteralSearch('my normal string');
        expect(reg).is.not.undefined;
        expect(reg.toString()).is.eq('/^my normal string$/')
    });

    it('Escapes special characters in literal', function () {

        const specialChars = ['-', '/', '\\', '^', '$', '*', '+', '?', '.', '(', ')', '|', '[', ']', '{', '}'];

        for (const char of specialChars) {
            const reg = parseToRegexOrLiteralSearch(`my normal${char} string`);
            expect(reg).is.not.undefined;
            expect(reg.toString()).is.eq(`/^my normal\\${char} string$/`, `Did not escape '${char}' `);
        }
    });

    it('Transforms string when configured', function () {
        const reg = parseToRegexOrLiteralSearch('my normal string', {
            transform: [
                {
                    search: /normal/i,
                    replace: 'plain'
                }
            ]
        });
        expect(reg).is.not.undefined;
        expect(reg.toString()).is.eq('/^my plain string$/')
    });

    it('Trims string literal when configured', function () {
        const reg = parseToRegexOrLiteralSearch(' my normal string ', {trim: true});
        expect(reg).is.not.undefined;
        expect(reg.toString()).is.eq('/^my normal string$/')
    });

    describe('Search Behavior', function () {

        const str = 'my normal string';

        const behaviors = [
            {
                name: 'exact',
                reg: `/^${str}$/`
            },
            {
                name: 'endsWith',
                reg: `/${str}$/`
            },
            {
                name: 'startsWith',
                reg: `/^${str}/`
            },
            {
                name: 'contains',
                reg: `/${str}/`
            }
        ]

        for (const behavior of behaviors) {
            it(`Parses behavior '${behavior.name}' to correct regex`, function () {
                const reg = parseToRegexOrLiteralSearch(str, {behavior: behavior.name as LiteralSearchBehavior});
                expect(reg).is.not.undefined;
                expect(reg.toString()).is.eq(behavior.reg)
            });
        }
    });

    describe('Caching', function () {
        it('Built-in caching works', function () {
            const cachedParser = parseToRegexOrLiteralSearchCached(2);

            const reg = cachedParser('/my (reg)?ular expression/');
            expect(reg).is.not.undefined;
            expect(reg.toString()).is.eq('/my (reg)?ular expression/')

            const cachedReg = cachedParser('/my (reg)?ular expression/');
            expect(cachedReg).is.not.undefined;
            expect(cachedReg.toString()).is.eq('/my (reg)?ular expression/')
        });
    });
});

describe('parseRegex', function () {

    it('non-global regex returns a single RegExResult', function () {
        const regResults = parseRegex(/normal/i, 'my normal super normal string');
        expect(regResults.length).is.eq(1);
        expect(regResults.every(isRegExResult)).to.be.true;
        expect(regResults[0].match).is.eq('normal')
        expect(regResults[0].index).is.eq(3)
    });

    it('global regex returns multiple RegExResult', function () {
        const regResults = parseRegex(/normal/g, 'my normal super normal string');
        expect(regResults.length).is.eq(2);
        expect(regResults.every(isRegExResult)).to.be.true;
        expect(regResults[0].match).is.eq('normal')
        expect(regResults[0].index).is.eq(3)
        expect(regResults[1].match).is.eq('normal')
        expect(regResults[1].index).is.eq(16)
    });
});

describe('parseSingleRegex', function () {

    it('errors if more than one result returned from regex', function () {
        expect(() => parseRegexSingle(/normal/g, 'my normal super normal string')).to.throw()
    });

    it('returns RegExResult if a single result is found', function () {
        expect(() => parseRegexSingle(/normal/i, 'my normal super normal string')).to.not.throw()
        expect(parseRegexSingle(/normal/i, 'my normal super normal string')).to.not.be.undefined;
    });

    it('no match returns undefined', function () {
        expect(parseRegexSingle(/ddddd/i, 'my normal super normal string')).to.be.undefined;
    });
});

describe('testMaybeRegex', function () {

    it('tests a valid regex string and returns true if match is found', function () {
        expect(testMaybeRegex('/normal/i', 'my normal super normal string')[0]).is.true;
    });

    it('tests a valid regex string and returns false if match is not found', function () {
        expect(testMaybeRegex('/ffff/i', 'my normal super normal string')[0]).is.false;
    });

    it('tests a string literal and returns true if match is found', function () {
        expect(testMaybeRegex('normal', 'my normal super normal string')[0]).is.true;
    });

    it('tests a string literal and returns false if match is not found', function () {
        expect(testMaybeRegex('ffff', 'my normal super normal string')[0]).is.false;
    });
});

describe('Search and Replace', function () {

    it('replaces when using a string literal', function () {
        expect(searchAndReplace('my normal super normal string', [{
            search: 'normal',
            replace: ''
        }])).to.eq('my  super  string');
    });

    it('replaces when using a valid regex string', function () {
        expect(searchAndReplace('my normal super normal string', [{
            search: '/normal/i',
            replace: ''
        }])).to.eq('my  super normal string');
    });
});
