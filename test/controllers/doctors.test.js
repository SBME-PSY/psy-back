const fs = require('fs');
const path = require('path');
const chai = require('chai');

const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');

chai.config.includeStack = true;
const server = require('../../server');
const { doctorModel } = require('../../models');

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Doctor Controller', () => {
  let token = '';
  const createdFiles = [];
  let cvFile = '';
  cvFile = fs.readFileSync(
    path.resolve(__dirname, '../data/DummyCV_Base64URL.txt'),
    { encoding: 'utf8' }
  );
  const doctor = {
    name: 'saaed',
    password: 'Saeed1234__!',
    confirmPassword: 'Saeed1234__!',
    email: 'ramadan@gmail.com',
    role: 'doctor',
    phone: '01005172445',
    cvFile: cvFile,
    governorate: 'Cairo',
    sex: 'Male',
    maritalStatus: 'Single',
    specialization: 'Psychiatrist',
  };
  before((done) => {
    chai
      .request(server)
      .post('/psy/doctors/signup')
      .send(doctor)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('token');
        return doctorModel.findOne({ email: doctor.email }).select('cv');
      })
      .then((doc) => {
        createdFiles.push(doc.cv);
        return done();
      })
      .catch(done);
  });

  it('POST /psy/doctors/login', (done) => {
    const loginData = {
      email: doctor.email,
      password: doctor.password,
      role: 'doctor',
    };
    chai
      .request(server)
      .post('/psy/doctors/login')
      .send(loginData)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('token');
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        return done();
      })
      .catch((err) => done(err));
  });
  // let userResetPassword = '';
  // it('POST /psy/doctors/forgot-password', (done) => {
  //   // eslint-disable-next-line camelcase
  //   const email_role = {
  //     email: doctor.email,
  //     role: doctor.role,
  //   };
  //   chai
  //     .request(server)
  //     .post('/psy/doctors/forgot-password')
  //     .send(email_role)
  //     .then((res) => {
  //       res.should.have.status(200);
  //       // eslint-disable-next-line prefer-destructuring
  //       userResetPassword = res.body.userResetPassword;
  //       return done();
  //     })
  //     .catch((err) => done(err));
  // });
  // it(`POST /psy/doctors/reset-password/${userResetPassword}`, (done) => {
  //   const newPassword = {
  //     password: '123456789ss!',
  //     confirmPassword: '123456789ss!',
  //     role: doctor.role,
  //   };
  //   chai
  //     .request(server)
  //     .patch(`/psy/doctors/reset-password/${userResetPassword}`)
  //     .send(newPassword)
  //     .then((res) => {
  //       res.should.have.status(200);
  //       // eslint-disable-next-line prefer-destructuring
  //       token = res.body.token;
  //       doctor.password = newPassword.password;
  //       doctor.confirmPassword = newPassword.confirmPassword;

  //       return done();
  //     })
  //     .catch(done);
  // });
  // it('PATCH /psy/doctors/update-password', (done) => {
  //   const updatedPassword = {
  //     currentPassword: doctor.password,
  //     newPassword: '12345678s',
  //     confirmNewPassword: '12345678s',
  //     role: doctor.role,
  //   };
  //   chai
  //     .request(server)
  //     .patch('/psy/doctors/update-password')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(updatedPassword)
  //     .then((res) => {
  //       res.should.have.status(200);
  //       doctor.password = updatedPassword.password;
  //       doctor.confirmPassword = updatedPassword.confirmNewPassword;
  //       // eslint-disable-next-line prefer-destructuring
  //       token = res.body.token;
  //       return done();
  //     })
  //     .catch(done);
  // });
  // it('GET /psy/doctors/profile', (done) => {
  //   chai
  //     .request(server)
  //     .get('/psy/doctors/profile')
  //     .set('Authorization', `Bearer ${token}`)
  //     .then((res) => {
  //       res.should.have.status(200);
  //       res.body.data.should.have.property('name', 'saaed');
  //       res.body.data.should.have.property('email', 'ramadan@gmail.com');
  //       return done();
  //     })
  //     .catch(done);
  // });

  // it('PATCH /psy/doctors/profile', (done) => {
  //   const editedInformation = {
  //     name: 'Ramadan',
  //     email: 'ramadan123@gmail.com',
  //     role: 'admin',
  //     status: 'approved',
  //   };
  //   chai
  //     .request(server)
  //     .patch('/psy/doctors/profile')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(editedInformation)
  //     .then((res) => {
  //       res.should.have.status(200);
  //       res.body.data.should.have.property('name', 'Ramadan');
  //       res.body.data.should.have.property('email', 'ramadan123@gmail.com');
  //       res.body.data.should.have.property('role', 'doctor');
  //       res.body.data.should.have.property('status', 'pending');
  //       return done();
  //     })
  //     .catch(done);
  // });

  // it('PATCH /psy/doctors/profile upload profile picture', (done) => {
  //   chai
  //     .request(server)
  //     .patch('/psy/doctors/profile')
  //     .set('Authorization', `Bearer ${token}`)
  //     .field('Content-Type', 'multipart/form-data')
  //     .attach(
  //       'profilePicture',
  //       path.resolve(__dirname, '../data/profile-picture.svg')
  //     )
  //     .then((res) => {
  //       res.should.have.status(200);
  //       return doctorModel.findOne({ phone: doctor.phone }).select('picture');
  //     })
  //     .then((doc) => {
  //       createdFiles.push(
  //         path.resolve(
  //           __dirname,
  //           `../../public/doctors/profile-picture/${doc.picture}`
  //         )
  //       );
  //       return done();
  //     })
  //     .catch(done);
  // });

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

  it('GET /psy/doctors', (done) => {
    chai
      .request(server)
      .get('/psy/doctors')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        res.body.data.length.should.be.eql(1);
        return done();
      })
      .catch(done);
  });

  after((done) => {
    doctorModel
      .deleteMany({})
      .then(() => {
        createdFiles.forEach((file) => {
          fs.unlinkSync(
            path.resolve(
              file.replace('/static', path.resolve(__dirname, '../../public/'))
            ),
            (err) => done(err)
          );
        });
        return done();
      })
      .catch(done);
  });
});
