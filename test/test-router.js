import assert from 'assert';
import Router from '..';

const routes = [
  {path: '/'},
  {path: '/users'},
  {path: '/users/<id>'},
  {path: '/users/<id>/edit'}
];

const r = new Router();

r.init({
  routes: routes
});

describe('', () => {
  it('static', () => {
    assert.deepEqual(r.match('/'), {
      route: routes[0],
      params: {}
    });

    assert.deepEqual(r.match('/users'), {
      route: routes[1],
      params: {}
    });
  });

  it('dynamic', () => {
    assert.deepEqual(r.match('/users/1'), {
      route: routes[2],
      params: {id: 1}
    });

    assert.deepEqual(r.match('/users/2'), {
      route: routes[2],
      params: {id: 2}
    });
  });
});
