// Regexps shamelessly stolen from Angular
const ARROW_ARG = /^([^(]+?)=>/;
const FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
const ARG_SPLIT = /,/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

export default class Injector {
  constructor() {
    this._deps = {};
  }

  get(key) {
    return this._deps[key];
  }

  register(key, val) {
    this._deps[key] = val;
  }

  resolve(fn, overrides = {}) {
    if (!Injector.hasParams(fn)) {
      return fn;
    }

    return () => {
      const deps = Injector.getParamNames(fn);
      const args = deps.map((dep) => overrides[dep] || this.get(dep));

      fn(...args);
    };
  }

  invoke(fn, overrides = {}) {
    return this.resolve(fn, overrides)();
  }

  static getParamString(fn) {
    const str = Function.prototype.toString.call(fn).replace(STRIP_COMMENTS, '');
    return (str.match(ARROW_ARG) || str.match(FN_ARGS))[1];
  }

  static hasParams(fn) {
    return Injector.getParamString(fn).trim() !== '';
  }

  static getParamNames(fn) {
    return Injector.getParamString(fn)
      .split(ARG_SPLIT)
      .map((arg) => arg.trim());
  }
}
