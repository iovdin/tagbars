Package.describe({
  name: 'iovdin:tagbars',
  summary: "use templates as html tags",
  version: '0.0.1',
  git: 'https://github.com/iovdin/tagbars.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "compileTagbars",
  use: ['minifiers@1.1.5', 'spacebars-compiler@1.0.6'],
  sources: [
    'plugin/compile-templates.js',
    'plugin/html-scanner.js'
  ],
  npmDependencies: {cheerio: "0.9.0"}
});

