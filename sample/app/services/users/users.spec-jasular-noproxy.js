// This only needs doing once per app. Put here for demonstration only.
jasular.noProxy(['printerService']);

describe('userService-jasular-noproxy', ['app.users'], ($q, $rootScope, userService, mockPrinterService) => {

  beforeEach(() => {
    mockPrinterService.obj.print.and.callFake(() => $q.when('[user info]'));
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
      expect(mockPrinterService.obj.print).toHaveBeenCalledWith({id: 2, name: 'Jane'});
      cb();
    });
    $rootScope.$apply();
  });
});
