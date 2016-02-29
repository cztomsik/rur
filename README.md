# RUR
Batteries-included client-side router

## Features
- named routes
- pretty urls
- straighforward API, framework-agnostic
- dependency-free, ES5-compatible
- simple, [readable source code](https://github.com/cztomsik/rur/blob/master/src/router.js)

## Why?
  - [router.js](https://github.com/tildeio/router.js/) is ember-focused and weighs over 50 KBs
  - [router5](https://github.com/router5/router5/) does not work in older browsers and needs plugins & polyfills to be actually useful
  - others do not support opening link in new tab

## Install
    npm install rur --save

## Usage
    var Router = require('rur');
    var r = new Router();

    r.routes = [
      {name: 'home', path: ''},
      {name: 'users', path: 'users'},
      {name: 'show-user', path, 'users/:id'},
      {name: 'edit-user', path, 'users/:id/edit'}
    ];

    r.onChange = function(){
      if ( ! r.match){
        return r.go('home');
      }

      console.log(r);
    };

    r.start();

To get url

    r.getUrl('edit-user', {id: 1});

To go to another page

    r.go('edit-user', {id: 1});


## HTML5 urls
Currently unsupported because:

  - IE9 does not support `pushState()` at all
  - IE10/Edge support is still buggy
  - not even Firefox & Webkit currently behave the same
  - it requires global link handler (so the default action is prevented and `pushState()` is used) which is kinda hacky and unmodular (and will take some time to implement correctly)

It is probably going to appear in future (with little or no change in the current API)
