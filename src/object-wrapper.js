export default class ObjectWrapper {
  constructor() {
    const self = this;
    this._inject = {
      get obj() {
        return self._target;
      },
      get() {
        return self._target;
      }
    }
  }

  setTarget(target) {
    this._target = target;
  }

  getInject() {
    return this._inject;
  }
}
