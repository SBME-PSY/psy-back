const { describe, before, it, after } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const userModel = require('../../models/userModel');

chai.config.includeStack = true;
chai.should();

chai.use(chaiHttp);
describe('User controller', () => {
  // eslint-disable-next-line no-unused-vars
  let token = '';
  const user = {
    name: 'saaed',
    password: 'Saeed1234__',
    confirmPassword: 'Saeed1234__',
    email: 'saeed@gmail.com',
    role: 'user',
    phone: '01005172445',
  };
  before((done) => {
    // server.listen(3000, done);
    chai
      .request(server)
      .post('/psy/users/signUp')
      .send(user)
      .then((res) => {
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        return done();
      })
      .catch(done);
  });
  it('POST /psy/users/login ', (done) => {
    const loginData = {
      email: user.email,
      password: user.password,
      role: 'user',
    };
    chai
      .request(server)
      .post('/psy/users/login')
      .send(loginData)
      .then((res) => {
        res.should.have.status(200);
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        return done();
      })
      .catch(done);
  });
  it('PATCH /psy/users/update-password', (done) => {
    const updatedPassword = {
      currentPassword: user.password,
      newPassword: '12345678s',
      confirmNewPassword: '12345678s',
      role: user.role,
    };
    chai
      .request(server)
      .patch('/psy/users/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPassword)
      .then((res) => {
        res.should.have.status(200);
        user.password = updatedPassword.password;
        user.confirmPassword = updatedPassword.confirmNewPassword;
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        return done();
      })
      .catch(done);
  });
  // eslint-disable-next-line no-unused-vars
  let userResetPassword = '';
  it('POST /psy/users/forgot-password', (done) => {
    // eslint-disable-next-line camelcase
    const email_role = {
      email: user.email,
      role: user.role,
    };
    chai
      .request(server)
      .post('/psy/users/forgot-password')
      .send(email_role)
      .then((res) => {
        res.should.have.status(200);
        // eslint-disable-next-line prefer-destructuring
        userResetPassword = res.body.userResetPassword;
        return done();
      })
      .catch(done);
  });
  it(`PATCH /psy/users/reset-password/${userResetPassword}`, (done) => {
    // eslint-disable-next-line camelcase
    const newPassword = {
      password: '123456789ss',
      confirmPassword: '123456789ss',
      role: user.role,
    };
    chai
      .request(server)
      .patch(`/psy/users/reset-password/${userResetPassword}`)
      .send(newPassword)
      .then((res) => {
        res.should.have.status(200);
        // eslint-disable-next-line prefer-destructuring
        user.password = newPassword.password;
        user.confirmPassword = newPassword.confirmPassword;
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        return done();
      })
      .catch(done);
  });
  after((done) => {
    userModel
      .deleteMany({})
      .then(() => done())
      .catch(done);
    // server.close(done);
  });
});
