const KEYS = /:(\w+)/g;

export default class Router{
  constructor(){
    this.routes = [];
    this.onChange = null;
  }

  go(routeName, params){
    location.href = this.getUrl(routeName, params);
  }

  getUrl(routeName, params){
    return '#' + this._getPath(routeName, params);
  }

  start(){
    const listener = () => {
      this.onChange(this._match(location.hash.slice(1)) || {route: null, params: null});
    };

    addEventListener('hashchange', listener);
    listener();
  }

  _getPath(routeName, params = {}){
    const route = this._getRoute(routeName);
    const pathKeys = (route.path.match(KEYS) || []).map(k => k.slice(1));
    const paramKeys = Object.keys(params);

    if (JSON.stringify(pathKeys) !== JSON.stringify(paramKeys)){
      die('missing/extra params', route, params);
    }

    return route.path.replace(KEYS, (m, k) => params[k]);
  }

  _getRoute(routeName){
    return this.routes.filter(r => r.name === routeName)[0] || die(routeName, 'not found');
  }

  _match(path){
    for (let i = 0; i < this.routes.length; i++){
      const route = this.routes[i];
      const pathKeys = (route.path.match(KEYS) || []).map(k => k.slice(1));
      const match = path.match(this._getPathRegExp(route.path));

      if (match){
        return {route, params: zipObject(pathKeys, ...match.slice(1))};
      }
    }

    return null;
  }

  _getPathRegExp(path){
    return new RegExp('^' + path.replace(KEYS, '([^/]*?)') + '$');
  }
}

function die(){
  throw new Error(Array.prototype.join.call(arguments, ' '));
}

function zipObject(keys, values){
  return keys.reduce((obj, k, i) => {
    obj[k] = values[i];
    return obj;
  }, {});
}
