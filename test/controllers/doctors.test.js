const path = require('path');
const chai = require('chai');

const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');

chai.config.includeStack = true;
const server = require('../../server');
const doctorModel = require('../../models/doctorModel');

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Doctor Controller', () => {
  let token = '';
  const createdFiles = [];
  const doctor = {
    name: 'saaed',
    password: 'Saeed1234__',
    confirmPassword: 'Saeed1234__',
    email: 'ramadan@gmail.com',
    role: 'doctor',
    phone: '01005172445',
    cvFile: path.resolve(__dirname, '../data/dummyCV.pdf'),
  };
  before((done) => {
    chai
      .request(server)
      .post('/psy/doctors/signup')
      .field('Content-Type', 'multipart/form-data')
      .field('name', doctor.name)
      .field('email', doctor.email)
      .field('password', doctor.password)
      .field('confirmPassword', doctor.confirmPassword)
      .field('role', doctor.role)
      .field('phone', doctor.phone)
      .attach('cvFile', doctor.cvFile)
      .then((res) => {
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        return doctorModel.findOne({ email: doctor.email }).select('cv');
      })
      .then((doc) => {
        createdFiles.push(
          path.resolve(__dirname, `../../public/doctorPdf/${doc.cv}`)
        );
        return done();
      })
      .catch(done);
  });
  it('POST /psy/doctors/logIn ', (done) => {
    const loginData = {
      email: doctor.email,
      password: doctor.password,
      role: 'doctor',
    };
    chai
      .request(server)
      .post('/psy/doctors/logIn')
      .send(loginData)
      .then((res) => {
        res.should.have.status(200);
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        return done();
      })
      .catch(done);
  });
  // eslint-disable-next-line no-unused-vars
  let userResetPassword = '';
  it('POST /psy/doctors/forgot-password', (done) => {
    // eslint-disable-next-line camelcase
    const email_role = {
      email: doctor.email,
      role: doctor.role,
    };
    chai
      .request(server)
      .post('/psy/doctors/forgot-password')
      .send(email_role)
      .then((res) => {
        res.should.have.status(200);
        // eslint-disable-next-line prefer-destructuring
        userResetPassword = res.body.userResetPassword;
        return done();
      })
      .catch(done);
  });
  it(`POST /psy/doctors/reset-password/${userResetPassword}`, (done) => {
    // eslint-disable-next-line camelcase
    const newPassword = {
      password: '123456789ss',
      confirmPassword: '123456789ss',
      role: doctor.role,
    };
    console.log(`/psy/doctors/reset-password/${userResetPassword}`);
    chai
      .request(server)
      .patch(`/psy/doctors/reset-password/${userResetPassword}`)
      .send(newPassword)
      .then((res) => {
        res.should.have.status(200);
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        doctor.password = newPassword.password;
        doctor.confirmPassword = newPassword.confirmPassword;

        return done();
      })
      .catch(done);
  });
  it('PATCH /psy/doctors/update-password', (done) => {
    const updatedPassword = {
      currentPassword: doctor.password,
      newPassword: '12345678s',
      confirmNewPassword: '12345678s',
      role: doctor.role,
    };
    chai
      .request(server)
      .patch('/psy/doctors/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPassword)
      .then((res) => {
        res.should.have.status(200);
        doctor.password = updatedPassword.password;
        doctor.confirmPassword = updatedPassword.confirmNewPassword;
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        return done();
      })
      .catch(done);
  });
  it('GET /psy/doctors/profile', (done) => {
    chai
      .request(server)
      .get('/psy/doctors/profile')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.data.should.have.property('name', 'saaed');
        res.body.data.should.have.property('email', 'ramadan@gmail.com');
        return done();
      })
      .catch(done);
  });

  it('PATCH /psy/doctors/profile', (done) => {
    const editedInformation = {
      name: 'Ramadan',
      email: 'ramadan123@gmail.com',
      role: 'admin',
      status: 'approved',
    };
    chai
      .request(server)
      .patch('/psy/doctors/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(editedInformation)
      .then((res) => {
        res.should.have.status(200);
        res.body.data.should.have.property('name', 'Ramadan');
        res.body.data.should.have.property('email', 'ramadan123@gmail.com');
        res.body.data.should.have.property('role', 'doctor');
        res.body.data.should.have.property('status', 'pending');
        return done();
      })
      .catch(done);
  });

  it('PATCH /psy/doctors/profile upload profile picture', (done) => {
    chai
      .request(server)
      .patch('/psy/doctors/profile')
      .set('Authorization', `Bearer ${token}`)
      .field('Content-Type', 'multipart/form-data')
      .attach(
        'profilePicture',
        path.resolve(__dirname, '../data/profile-picture.svg')
      )
      .then((res) => {
        res.should.have.status(200);
        return doctorModel.findOne({ phone: doctor.phone }).select('picture');
      })
      .then((doc) => {
        createdFiles.push(
          path.resolve(
            __dirname,
            `../../public/doctors/profile-picture/${doc.picture}`
          )
        );
        return done();
      })
      .catch(done);
  });

  it("Can't PATCH /psy/doctors/profile without token", (done) => {
    const editedInformation = {
      name: 'Ramadan',
      email: 'ramadan123@gmail.com',
      role: 'admin',
      status: 'approved',
    };
    chai
      .request(server)
      .patch('/psy/doctors/profile')
      .send(editedInformation)
      .then((res) => {
        res.should.have.status(500);
        return done();
      })
      .catch(done);
  });

  after((done) => {
    doctorModel
      .deleteMany({})
      .then(() => done())
      .catch(done);
  });
});
