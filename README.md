### Jasular: supercharged unit test support for Angular 1 and Jasmine

Warning: this library is in very early stage development, use at your own risk.

#### Interface

A common way to write a unit test for an Angular component with Jasmine is:

```js
describe('componentUnderTest', () => {
  // Components
  let $ngDep1;
  let $ngDep2;
  let componentUnderTest;

  // Mocks
  let mockService1;
  let mockService2;

  // Populate mocks
  beforeEach(() => {
    mockService1 = jasmine.createSpyObj('mockService1', [...]);
    mockService2 = jasmine.createSpyObj('mockService2', [...]);
  });

  // Load module
  beforeEach(module('someModule'));

  // Populate components
  beforeEach(inject((_$ngDep1_, _$ngDep2_, _componentUnderTest_) => {
    $ngDep1 = _$ngDep1_;
    $ngDep2 = _$ngDep2_;
    componentUnderTest = _componentUnderTest_;
  }));

  // "Real" test starts here...
});
```

With Jasular, you can now write:

```js
// Global, once per app
jasular.mocks({mockService1: [...], mockService2: [...]})

describe('componentUnderTest', ['someModule'], (componentUnderTest, $ngDep1, $ngDep2, mockService1, mockService2) => {
  // "Real" test starts here...
});
```

#### Shared References

Jasular is smart enough to "reset" injected services before every test run even though the same references are shared in a describe block. By default, Jasular uses ES6 Proxy as the underlying reset mechanism. In a nutshell, the actual proxy target is changed from one test to another. In environments that do not support ES6 Proxy or in certain rare circumstance when an object cannot be transparently swapped without breaking a test, Jasular provides an escape hatch via object wrapper.

```js
jasular.noProxy(['mockService2']);

describe('componentUnderTest', ['someModule'], (componentUnderTest, $ngDep1, $ngDep2, mockService1, mockService2) => {
  it('...', () => {
    mockService2.obj; // obj -> wrapped object
  });
});
```

#### Run Sample Test

The `sample` directory contains a working example that shows tests written without Jasular, with Jasular and with the object wrapper workaround. To run these tests, use these commands (require `Node 8`):

```bash
npm i && npm run build
npm run sample
```
