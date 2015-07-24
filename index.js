var DOM_EVENT = 'hashchange';

module.exports = rur;

function rur(opts){
  var routes = {};
  var router = {
    current: {
      route: null,
      params: null
    },

    go: function(routeName, params){
      location = router.url(routeName, params);
    },

    url: function(routeName, params){
      return '#' + xyz(routes[routeName], params);
    },

    start: function(){
      addEventListener(DOM_EVENT, update);

      if (router.current.route === null){
        update();
      }
    },

    stop: function(){
      removeEventListener(DOM_EVENT, update);
    },

    onChange: opts.onChange || function(){}
  };

  opts.routes.forEach(add);

  return router;


  function add(route){
    routes[route.name] = route;
  }

  function update(){
    var str = location.hash.slice(1);
    var data = JSON.parse(str || '{}');

    router.current = {
      route: routes[data.page],
      params: data.params
    };

    router.onChange();
  }

  function xyz(route, params){
    return JSON.stringify({page: route.name, params: params});
  }
}
