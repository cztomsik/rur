/* global location, addEventListener, removeEventListener */
var DOM_EVENT = 'hashchange';

// TODO: config
var BASE = '#/';

module.exports = rur;

// returns new *uninitialized* router
// so it can be shared across ES6 modules
function rur(){
  var router = {
    current: {},
    routes: null,
    onChange: null,

    init: function(){
      addEventListener(DOM_EVENT, update);
      update();
    },

    urlFor: function(routeId, params){
      var route = findBy(router.routes, 'id', routeId);
      var qs = Object.keys(params || {}).map(function(k){
        return k + '=' + encodeURIComponent(params[k]);
      }).join('&');

      return BASE + route.path + (qs && ('?' + qs));
    },

    redirectTo: function(routeId, params){
      location.assign(this.urlFor(routeId, params));
    },

    forwardTo: function(routeId, params){
      location.replace(this.urlFor(routeId, params));
    },

    destroy: function(){
      removeEventListener(DOM_EVENT, update);
    }
  };

  return router;


  function update(){
    var parts = (location.href.split(BASE)[1] || '').split('?');

    router.current = {
      route: findBy(router.routes, 'path', parts[0] || ''),
      params: parseQs(parts[1])
    };

    router.onChange();
  }
}

function findBy(arr, key, val){
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === val){
      return arr[i];
    }
  }
}

function parseQs(qs){
  var params = {};

  return qs && qs.replace(/(.*?)=(.*?)(&|$)/g, function(match, key, val){
    params[key] = decodeURIComponent(val);
  }) && params;
}
