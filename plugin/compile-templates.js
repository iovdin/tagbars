var path = Npm.require('path');
var cheerio = Npm.require('cheerio');

var knownSVGElementNames = 'altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion animateTransform circle clipPath color-profile cursor defs desc ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font font-face font-face-format font-face-name font-face-src font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient marker mask metadata missing-glyph path pattern polygon polyline radialGradient rect script set stop style svg switch symbol text textPath title tref tspan use view vkern'.split(' ');

var knownElementNames = 'a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command data datagrid datalist dd del details dfn dir div dl dt em embed eventsource fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins isindex kbd keygen label legend li link main map mark menu meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr'.split(' ').concat(knownSVGElementNames);


var reservedElementNames = ['template'];
var html2spacebarAttrs = function(attrs){
    //TODO: order is important
    var attrArray = [];
    for (var key in attrs){
        var value = attrs[key];
        if(value){
            //TODO: escape quotes
            attrArray.push(key + "='" + value + "'");
        } else {
            attrArray.push(key);
        }
    }
    return " " + attrArray.join(" ") + " ";
}

var replaceUnkownTagsWithSpacebars = function(contents) {
    $ = cheerio.load(contents);
    $("content").each(function(){
        $(this).replaceWith("{{> Template.contentBlock}}");
    });
    $("*").each(function(){
        if(this.type != "tag") return;
        if(knownElementNames.indexOf(this.name) >= 0) return;
        if(reservedElementNames.indexOf(this.name) >= 0) return;
        if(this.children.length == 0) {
            $(this).replaceWith("{{>" + this.name + html2spacebarAttrs(this.attribs) + "}}");
        } else {
            $(this).replaceWith("{{#" + this.name + html2spacebarAttrs(this.attribs) + "}}\n" 
                                + $(this).html() 
                                + "\n{{/" + this.name + "}}");

        }
    });
    return $.html();
}
var doHTMLScanning = function (compileStep, htmlScanner) {
  // XXX the way we deal with encodings here is sloppy .. should get
  // religion on that
  var contents = compileStep.read().toString('utf8');
  try {
      contents = replaceUnkownTagsWithSpacebars(contents);
      var results = htmlScanner.scan(contents, compileStep.inputPath);
  } catch (e) {
    if (e instanceof htmlScanner.ParseError) {
      compileStep.error({
        message: e.message,
        sourcePath: compileStep.inputPath,
        line: e.line
      });
      return;
    } else {
      throw e;
    }
  }

  if (results.head)
    compileStep.appendDocument({ section: "head", data: results.head });

  if (results.body)
    compileStep.appendDocument({ section: "body", data: results.body });

  if (results.js) {
    var path_part = path.dirname(compileStep.inputPath);
    if (path_part === '.')
      path_part = '';
    if (path_part.length && path_part !== path.sep)
      path_part = path_part + path.sep;
    var ext = path.extname(compileStep.inputPath);
    var basename = path.basename(compileStep.inputPath, ext);

    // XXX generate a source map

    compileStep.addJavaScript({
      path: path.join(path_part, "template." + basename + ".js"),
      sourcePath: compileStep.inputPath,
      data: results.js
    });
  }
};

Plugin.registerSourceHandler(
  "htm", {isTemplate: true, archMatching: 'web'},
  function (compileStep) {
    doHTMLScanning(compileStep, html_scanner);
  }
);
