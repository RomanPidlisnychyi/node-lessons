const should = require('should');
const sinon = require('sinon');
const userController = require('../../module_04/api/users/userController');
const userModel = require('../../module_04/api/users/userModel');
const {
  UnauthorizedError,
  NotFoundError,
} = require('../../module_04/api/helpers/errorsConstructor');

const sum = (a, b) => {
  if (a === 1) {
    throw new Error();
  }
  return a + b;
};

describe('Unit tests suitcase example', () => {
  describe('#checkUser', () => {
    let sandbox;
    let findUserByEmailStub;
    let actualResult;

    const email = 'email@email.com';
    const password = 'password';

    before(async () => {
      sandbox = sinon.createSandbox();
      findUserByEmailStub = sandbox.stub(userModel, 'findUserByEmail');

      try {
        await userController.checkUser(email, password);
      } catch (err) {
        actualResult = err;
      }
    });

    after(() => {
      sandbox.restore();
    });

    it('should call findUserByEmail', () => {
      // sinon.assert.calledOnce(findUserByEmailStub);
      // sinon.assert.calledWithExactly(findUserByEmailStub, email);
      sinon.assert.calledOnceWithExactly(findUserByEmailStub, email);
    });

    it('should throw error', () => {
      (actualResult instanceof UnauthorizedError).should.be.true();
    });
  });

  describe('#sum', () => {
    it('should return expected result', () => {
      const result = sum(5, 3);
      result.should.be.eql(8);
    });

    it('should not pass', () => {
      should.throws(() => sum(1, 5));
    });
  });
});
