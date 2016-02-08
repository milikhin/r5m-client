define([], function() {
  return function(w) {
    try {
      new window.CustomEvent("test");
    } catch (e) {
      var CustomEvent = function(event, params) {
        var evt;
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };

        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      };

      CustomEvent.prototype = window.Event.prototype;
      w.CustomEvent = CustomEvent;
    }
  };
});
