# rtr
simplest possible (yet usable) router

    var router = rur({
      routes: [
        {name: 'home', metainfo: ...}
      ]
    });

    router.onChange = function(){
      // router.current.route
      // router.current.params
      console.log(router.current);
    };

    router.go('home');
    router.start();
    router.stop();