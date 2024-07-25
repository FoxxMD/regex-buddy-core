/** @type { import('typedoc').TypeDocOptionMap } */
module.exports ={
    name: "@foxxmd/regex-buddy-core Docs",
    entryPoints: [
        "./src/index.ts",
    ],
    sort: ["source-order"],
    categorizeByGroup: false,
    searchGroupBoosts: {
        "Functions": 1.5
    },
    navigationLinks: {
        "Docs": "http://foxxmd.github.io/regex-buddy-core",
        "GitHub": "https://github.com/foxxmd/regex-buddy-core"
    },
    plausibleSiteDomain: process.env.ANALYTICS ?? '',
    plausibleSiteOrigin: process.env.ANALYTICS_DOMAIN ?? '',
}
