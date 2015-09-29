# rur
simple, deps-free, path/qs router

    var router = rur();
    
    router.routes = [
      {id: 'home', path: '', metainfo: ...},
      {id: 'login', path: 'login', ...}
    ];

    router.onChange = function(){
      // router.current.route
      // router.current.params
      console.log(router.current);
    };

    router.init();
    router.destroy();
