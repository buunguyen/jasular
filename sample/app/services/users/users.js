angular.module('app.users', []).factory('userService', ($q, printerService) => {

  // We're gonna fake as if the data comes from server
  // Need to have something to test out the injected $q and $rootScope (in test)
  const fakeRemoteUsers = [
    {id: 1, name: 'John'},
    {id: 2, name: 'Jane'},
  ];

  return {
    find(id) {
      const loadUsers = $q.resolve(fakeRemoteUsers);
      return loadUsers.then((users) => {
        return users.find((user) => user.id === id)
      });
    },

    print(id) {
      return this.find(id).then((user) => {
        if (!user) return $q.reject('User not found');
        return printerService.print(user);
      });
    }
  };
});
