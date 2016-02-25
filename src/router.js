const KEYS = /<(.*?)>/g;

export default function rur(){
  return {
    init(options){
      this.routes = options.routes;

      this.state = {
        route: null,
        params: null
      };
    },

    goTo(routeName, params){
      window.location = this.getUrl(routeName, params);
    },

    getUrl(routeName, params = {}){
      // find route
      const route = this.routes.find(r => r.name === routeName);

      // inject path params
      const path = route.path.replace(KEYS, k => params[k]);

      // encode rest of params to query string
      const qs = getQs(ommit(params, route.path.match(keys)));

      return path + qs && ('?' + qs);
    },

    handle(url){
      this.state = this.match(url);
    },

    match(url){
      // find route which regex matches path
      // match path using regex & get results (pair with keys)
      // parse qs
      // merge data into params
      // return {route, params}

      const [path, qs] = url.split('?');

      const route = this.routes.find(r => getPathRegex(r.path).test(path));
      const params = zipObject(keys(route.path) || [], path.match(getPathRegex(route.path)).slice(1));

      Object.assign(params, parseQs(qs || ''));

      return {route, params};
    }
  };
}

function getPathRegex(path){
  return new RegExp('^' + path.replace(KEYS, '(.*)') + '$');
}

function keys(path){
  const res = [];
  let match = null;

  KEYS.lastIndex = 0;

  while(match = KEYS.exec(path)){
    res.push(match[1]);
  }

  return res;
}

function ommit(obj, keys){
  const res = {};

  for (let k in obj){
    if (keys.includes(k)){
      continue;
    }

    res[k] = obj[k];
  }
}

function getQs(data){
  return Object.keys(data || {}).map(function(k){
    return k + '=' + encodeURIComponent(data[k]);
  }).join('&');
}

function parseQs(qs){
  const data = {};

  return qs && qs.replace(/(.*?)=(.*?)(&|$)/g, function(match, key, val){
    data[key] = decodeURIComponent(val);
  }) && data;
}

function zipObject(keys, values){
  const obj = {};

  keys.forEach((k, i) => {
    obj[k] = values[i];
  });

  return obj;
}
