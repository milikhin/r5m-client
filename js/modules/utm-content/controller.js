define(['r5m/modules/lib/query-parser'], function(QueryParser) {

  function UtmContent() {
    this.title = 'utmcontent';
		this.name = 'Utm-based content';

    this.params = window.r5m.utmContent;
    this.queryParser = new QueryParser(window.location.search);
  }

  UtmContent.prototype.init = function() {
    for(var utmParamName in this.params) {
      var utmParam = this.params[utmParamName];
      var utmElements = document.querySelectorAll('.' + utmParamName);
      for(var i in utmParam) {
        console.log(this.queryParser.get('utm_term'));
        if(this.queryParser.get('utm_term') && ~this.queryParser.get('utm_term').toLowerCase().indexOf(i)) {
          [].forEach.call(utmElements, function(utmElement) {
            utmElement.innerHTML = utmParam[i];
          }, this);
        }
      }
    }
  };

  return new UtmContent
});
