import assert from 'assert';
import Router from '..';

// fake listener
let _listener = null;
global.addEventListener = (event, listener) => {
  _listener = listener;
};

// fake location
global.location = {
  _href: '',
  hash: '',

  get href(){
    return this._href;
  },

  set href(href){
    this._href = href;
    this.hash = href.replace(/#.*/, '$&');
    _listener();
  }
};

const routes = [
  {name: 'home', path: '/'},
  {name: 'users', path: '/users'},
  {name: 'show-user', path: '/users/:id'},
  {name: 'edit-user', path: '/users/:id/edit'}
];

// count changes
let changes = 0;

const r = new Router();

r.init({
  routes: routes,

  onChange: () => {
    return Promise.resolve(changes++);
  }
});

describe('router', () => {
  it('init()', () => {
    assert.strictEqual(changes, 1);
  });

  it('go()', () => {
    changes = 0;
    location.href = '';

    return r.go('home').then(() => {
      assert.strictEqual(location.href, '#/');
      assert.strictEqual(r.state.route, routes[0]);
      assert.strictEqual(changes, 2);

      return r.go('users').then(() => {
        assert.strictEqual(location.href, '#/users');
        assert.strictEqual(r.state.route, routes[1]);
        assert.strictEqual(changes, 3);
      });
    });
  });

  it('getUrl(name, params)', () => {
    assert.strictEqual(r.getUrl('home'), '#/');
    assert.strictEqual(r.getUrl('home', {q: 'search'}), '#/?q=search');

    assert.strictEqual(r.getUrl('users'), '#/users');
    assert.strictEqual(r.getUrl('show-user', {id: 1}), '#/users/1');
    assert.strictEqual(r.getUrl('edit-user', {id: 1}), '#/users/1/edit');
  });
});

describe('_match', () => {
  it('static', () => {
    assert.deepEqual(r._match('/'), {
      route: routes[0],
      params: {}
    });

    assert.deepEqual(r._match('/users'), {
      route: routes[1],
      params: {}
    });
  });

  it('dynamic', () => {
    assert.deepEqual(r._match('/users/1'), {
      route: routes[2],
      params: {id: 1}
    });

    assert.deepEqual(r._match('/users/2'), {
      route: routes[2],
      params: {id: 2}
    });

    assert.deepEqual(r._match('/users/3/edit'), {
      route: routes[3],
      params: {id: 3}
    });
  });

  it('qs', () => {
    assert.deepEqual(r._match('/?q=search'), {
      route: routes[0],
      params: {q: 'search'}
    });
  });
});
