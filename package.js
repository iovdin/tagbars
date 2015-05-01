Package.describe({
  name: 'iovdin:tagbars',
  summary: "use templates as html tags",
  version: '0.0.1',
  git: 'https://github.com/iovdin/tagbars.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "compileTagbars",
  use: ['minifiers', 'spacebars-compiler'],
  sources: [
    'plugin/compile-templates.js',
    'plugin/html-scanner.js'
  ],
  npmDependencies: {cheerio: "0.9.0"}
});

