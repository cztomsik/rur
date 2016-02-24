export default class Router{
  /**
   * Default contructor so you can share instance with others even
   * before it is actually initialized.
   */
  constructor(){}

  /**
   * [init description]
   * @param {object} options options
   * @param {Array} options.routes array of route definitions
   * @param {string} options.base base URL
   * @param {Function} options.listener called when route has changed
   */
  init(options){
    this.routes = options.routes;

    // this is often practical to be public
    this.state = {
      route: null,
      routeParams: null
    };
  }

  handle(url){
    this.state = this.match(url);
  }

  match(path){
    return {
      route: this.routes.find(r => getPathRegex(r.path).test(path)),
      params: {}
    };
  }

  getUrl(routeName, params = {}){
    const route = this.routes.find(r => r.name === routeName);

    return route.path.replace(/<.*?>/g, k => params[k]);
  }

  goTo(routeName, params){
    return this.handle(this.getUrl(routeName, params));
  }
}

function getPathRegex(path){
  return new RegExp('^' + path.replace(/<(.*?)>/g, '(.*)') + '$');
}
