import RetargetableProxy from './retargetable-proxy';

export default class ProxyWrapper {
  constructor() {
    this._proxy = new RetargetableProxy();
  }

  setTarget(target) {
    this._proxy.target = target;
  }

  getInject() {
    return this._proxy.proxy;
  }
}
