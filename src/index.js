import Injector from './injector';
import ObjectWrapper from './object-wrapper';
import ProxyWrapper from './proxy-wrapper';

// API
const runOnce = [];
let ranOnce = false;
let mocks = {};
let noProxies = {};

export const jasular = {
  runOnce(fn) {
    runOnce.push(fn);
    return jasular;
  },
  mocks(more = {}) {
    Object.keys(more).map((dep) => mocks[dep] = more[dep]);
    return jasular;
  },
  noProxy(more = []) {
    more.map((dep) => noProxies[dep] = true);
    return jasular;
  }
};

// Override Jasmine's describe's
const isNode = typeof exports === 'object' && typeof module === 'object';
const root = isNode ? global : window;

root.describe = enhance.bind(null, root.describe);
root.fdescribe = enhance.bind(null, root.fdescribe);
root.xdescribe = enhance.bind(null, root.xdescribe);

function enhance(originalJasmineDescribe, ...args) {
  const {suiteName, modules, specDefinitions} = parseArgs(...args);

  // If no parameters, we're done
  if (!Injector.hasParams(specDefinitions)) {
    return originalJasmineDescribe(suiteName, specDefinitions);
  }

  // Otherwise, run our decorated spec definitions
  return originalJasmineDescribe(suiteName, () => {
    const deps = Injector.getParamNames(specDefinitions);
    const wrappers = {};
    const injector = new Injector();

    // Create wrappers
    for (const dep of deps) {
      const WrapperType = noProxies[normalizeDepName(dep)]
        ? ObjectWrapper
        : ProxyWrapper;
      const wrapper = new WrapperType();

      wrappers[dep] = wrapper;
      injector.register(dep, wrapper.getInject());
    }

    // Run global hooks
    if (ranOnce === false) {
      beforeAll(() => runOnce.map((fn) => fn()));
      ranOnce = true;
    }

    // Register mocks
    const MOCK_REGEXP = /^[\{]?mock/;
    const mockDeps = deps.filter((dep) => MOCK_REGEXP.test(dep));

    if (mockDeps.length) {
      beforeEach(() => {
        const mockObjs = mockDeps.reduce((mockObjs, mockName) => {
          mockName = normalizeDepName(mockName);
          if (mocks[mockName] == null) {
            throw new Error(`Unknown mock for: ${mockName}`);
          }

          mockObjs[mockName] = jasmine.createSpyObj(mockName, mocks[mockName]);
          return mockObjs;
        }, {});

        angular.mock.module(mockObjs);
      });
    }

    // Load modules
    modules.map((mod) => beforeEach(() => angular.mock.module(mod)));

    // Retarget wrappers
    beforeEach(angular.mock.inject(['$injector', ($injector) => {
      for (const dep of deps) {
        wrappers[dep].setTarget($injector.get(normalizeDepName(dep)));
      }
    }]));

    // Run the spec definitions with injected dependencies
    return injector.invoke(specDefinitions);
  });
}

// Utilities
function parseArgs(suiteName, modules, specDefinitions) {
  if (!modules) {
    throw new Error('suiteName and specDefinitions are required');
  }

  if (isFunction(modules)) {
    specDefinitions = modules;
    modules = [];
  }

  if (!isArray(modules)) {
    throw new Error('modules must be an array');
  }

  if (!isFunction(specDefinitions)) {
    throw new Error('specDefinitions must be a function');
  }

  return {suiteName, modules, specDefinitions};
}

function normalizeDepName(depName) {
  if (depName.startsWith('mock')) {
    depName = depName.substr(4);
    depName = depName[0].toLowerCase() + depName.substr(1);
  }
  return depName;
}

function isFunction(obj) {
  return {}.toString.call(obj) === '[object Function]';
}

function isArray(obj) {
  return {}.toString.call(obj) === '[object Array]';
}
