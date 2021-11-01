const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');

chai.Assertion.includeStack = true; // defaults to false
chai.config.includeStack = true;
const { describe, it, beforeEach } = mocha;
const server = require('../server');
const userModel = require('../models/userModel');

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Test logIn', () => {
  beforeEach((done) => {
    userModel.deleteMany({}, () => {
      done();
    });
  });
  // eslint-disable-next-line no-undef
  it('POST /psy/user/signUp', (done) => {
    const user = {
      name: 'saaed',
      password: 'Saeed1234__',
      confirmPassword: 'Saeed1234__',
      email: 'ramadan@Gmail.com',
      role: 'user',
      phone: '01005172445',
    };
    chai
      .request(server)
      .post('/psy/users/signup')
      .send(user)
      .end((err, response) => {
        response.should.have.status(201);
        done();
      });
  });
});
