
discribe('testing mocks', () => {
  let throwerMock: jest.SpyInstance;
  beforeAll(() => {
    throwerMock = jest.spyOn(TestedClass, 'thrower');
  })
});
