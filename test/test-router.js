import assert from 'assert';
import rur from '..';

const routes = [
  {path: '/', name: 'root'},
  {path: '/users', name: 'users'},
  {path: '/users/<id>', name: 'show-user'},
  {path: '/users/<id>/edit', name: 'edit-user'}
];

const r = rur();

r.init({
  routes: routes
});

describe('routes', () => {
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

    assert.deepEqual(r.match('/users/3/edit'), {
      route: routes[3],
      params: {id: 3}
    });
  });

  it('qs', () => {
    assert.deepEqual(r.match('/?q=search'), {
      route: routes[0],
      params: {q: 'search'}
    });
  });

  it('two way', () => {
    assert.strictEqual(r.getUrl('root'), '/');
    assert.strictEqual(r.getUrl('root', {q: 'search'}), '/?q=search');

    assert.strictEqual(r.getUrl('users'), '/users');
    assert.strictEqual(r.getUrl('show-user', {id: 1}), '/users/1');
    assert.strictEqual(r.getUrl('edit-user', {id: 1}), '/users/1/edit');
  });
});
