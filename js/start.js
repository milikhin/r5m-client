var isDebug = ~location.search.indexOf("debug=1");

require.config({
  baseUrl: './',
  packages: [{
    name: "r5m",
    main: "index",
    location: "bower_components/r5m-cms/js"
  }, {
    name: "vendor",
    location: "bower_components/"
  }]
});

require([isDebug ? 'r5m' : 'dist/lp'], function() {
  require([
    'r5m/app'
  ], function(app) {
    app(window.r5m.modules);
  });
});

(function() {
  if(window.r5m.app.EMAILJS_ID) {
    window.emailjs.init(window.r5m.app.EMAILJS_ID);
  }
})();
