define([], function() {

  function Page() {
    this.title = 'page';
    this.name = 'page';
  }

  Page.prototype.init = function(dimmerElem) {

  };

  Page.prototype.clickHandler = function(action, target) {
    switch (action) {
      case 'removeDOM':
      console.log(target);
        target.parentNode.removeChild(target);
        break;

      default:
        return;
    }
  };

  return new Page();
});
