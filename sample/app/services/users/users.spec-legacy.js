describe('userService-legacy', () => {

  let $q;
  let $rootScope;
  let userService;
  let mockPrinterService;

  beforeEach(() => {
    module('app.users');

    module(($provide) => {
      mockPrinterService = jasmine.createSpyObj('printerService', ['print']);
      mockPrinterService.print.and.callFake(() => $q.when('[user info]'));
      $provide.value('printerService', mockPrinterService);
    });

    inject((_$q_, _$rootScope_, _userService_) => {
      $q = _$q_;
      $rootScope = _$rootScope_;
      userService = _userService_;
    });
  });

  it('should find user.', (cb) => {
    userService.find(1).then((user) => {
      expect(user).toEqual({id: 1, name: 'John'});
      cb();
    });
    $rootScope.$apply();
  });

  it('should print user.', (cb) => {
    userService.print(2).then((text) => {
      expect(text).toEqual('[user info]');
      expect(mockPrinterService.print).toHaveBeenCalledWith({id: 2, name: 'Jane'});
      cb();
    });
    $rootScope.$apply();
  });
});
