define([], function() {
  function MenuHighlighter() {
    this.name = 'MenuHighlighter';
  };

  MenuHighlighter.prototype.init = function() {
    [].forEach.call(document.querySelectorAll('a'), function(linkElem) {
      console.log(linkElem.href, window.location.protocol + "//" + window.location.host + window.location.pathname)
      if(linkElem.href == window.location.protocol + "//" + window.location.host + window.location.pathname) {
        linkElem.classList.add('active');
      }
    });
  };

  return new MenuHighlighter();
});
