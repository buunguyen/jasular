export default class RetargetableProxy {
  constructor(target, handler) {
    this.target = target;
    this.handler = handler;

    const handlerWrapper = new Proxy({}, {
      get: (_, prop) => (_, ...args) => this.handler[prop](this.target, ...args)
    });

    // Needs to use a dummy function target so that real target can be invoked
    // as a function
    this._realProxy = new Proxy(() => {}, handlerWrapper);
  }

  get proxy() { return this._realProxy; }

  get target() { return this._mutableTarget; }
  set target(target = {}) { this._mutableTarget = target; }

  get handler() { return this._mutableHandler; }
  set handler(handler = Reflect) { this._mutableHandler = handler; }
}
