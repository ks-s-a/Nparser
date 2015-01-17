var casper = require('casper').create();
var siteLink = casper.cli.get(0);

if (!siteLink || siteLink.indexOf('.') === -1)
  casper.die('Wrong site link!');

//casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36');

casper.start('http://google.ru/', function() {
  // search for target from google form
  this.fill('form[action="/search"]', { q: 'site:' + siteLink }, true);
});

casper.then(parsePageAndClickToNext);

casper.run();

function getLinks() {
  var result = {};
  var linksElements = document.querySelectorAll('h3.r a');
  
  // Looking for next page button.
  result.haveMorePages = document.querySelectorAll('#nav td.b:last-child > a').length;
  
  // Extract links from the elements.
  result.searchLinks = Array.prototype.map.call(linksElements, function(e) {
      return e.getAttribute('href').slice(7).split('&')[0];
  });
  
  return result;
}

function evalAndShowLinks(ctx) {
  var res = ctx.evaluate(getLinks);

  res.searchLinks.forEach(function(v) { console.log(v) });

  return res.haveMorePages;
}

function parsePageAndClickToNext() {
  if (!evalAndShowLinks(this))
    return;
  
  casper.wait('2000', function() {
    casper.thenClick('#nav td.b:last-child > a', parsePageAndClickToNext);
  });
}