const replacements = [];
const baseUrl = process.env.BASE_TD_URL;
if(baseUrl !== undefined && baseUrl.trim() !== '') {
    const cleaned = baseUrl.replace(/^["']/, '').replace(/["']$/, '');
    replacements.push(
        {
            pattern: "https:\/\/foxxmd.github.io\/regex-buddy-core",
            replace: cleaned
        }
    );
}

/** @type { import('typedoc').TypeDocOptionMap & import('typedoc-plugin-replace-text').Config } */
module.exports ={
    name: "@foxxmd/regex-buddy-core Docs",
    entryPoints: [
        "./src/index.ts",
    ],
    plugin: ['typedoc-plugin-missing-exports','typedoc-plugin-replace-text','@8hobbies/typedoc-plugin-plausible'],
    out: 'typedocs',
    sort: ["source-order"],
    categorizeByGroup: false,
    searchGroupBoosts: {
        "Functions": 1.5
    },
    "projectDocuments": ["docs/*.md"],
    navigationLinks: {
        "Docs": "http://foxxmd.github.io/regex-buddy-core",
        "GitHub": "https://github.com/foxxmd/regex-buddy-core"
    },
    replaceText: {
        inIncludedFiles: true,
        replacements
    },
    plausibleSiteDomain: process.env.ANALYTICS ?? '',
    plausibleSiteOrigin: process.env.ANALYTICS_DOMAIN ?? '',
}
