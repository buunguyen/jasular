// Configures Jasular
jasular
  .runOnce(() => {
    console.log('global hook that runs once for all tests');
  })
  .mocks({
    printerService: ['print'],
  });
