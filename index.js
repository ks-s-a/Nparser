var casper = require('casper').create({
    clientScripts: ['nude/nude.min.js', 'nude/noworker.nude.min.js', 'nude/worker.nude.min.js']
});

var links = [ // array for interesting links

];

//casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36');

casper.start().eachThen(links, function(response) {
  this.thenOpen(response.data, parsePage);
});

casper.run();

function parsePage(res) {
  this.echo('Start list craeting!');

  var links = this.evaluate(function() {
    var elements = document.querySelectorAll('div.user-photo-content > a');

    return Array.prototype.map.call(elements, function(e) {
      return e.getAttribute('href');
    })
  });

  this.echo('Start pics operating!');

  this.eachThen(links, function(res){
    this.thenOpen(res.data, analyzePic);
  });
}

function analyzePic() {
  var result = this.evaluate(function(){
    var result;

    nude.init();
    nude.load(document.querySelector('article.article > img'));
    nude.scan(function(res){result = res});

    return result;
  });

  if (result) {
    this.capture('./photos/'+ Date.now() + '.png');
    this.echo('Detect in '+ Date.now() +' good link: '+ this.getCurrentUrl());
  }
}