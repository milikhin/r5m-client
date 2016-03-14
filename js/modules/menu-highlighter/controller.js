define([], function() {
  function MenuHighlighter() {
    this.name = 'MenuHighlighter';
  };

  MenuHighlighter.prototype.init = function() {
    [].forEach.call(document.querySelectorAll('a'), function(linkElem) {
      var targetElem = linkElem.closest('.r5m-nav-link') || linkElem;

      if(linkElem.href == window.location.protocol + "//" + window.location.host + window.location.pathname) {
        targetElem.classList.add('active');
      }
    });
  };

  return new MenuHighlighter();
});
