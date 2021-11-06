const path = require('path');
const chai = require('chai');
const fs = require('fs');

const { assert } = chai;
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

  after((done) => {
    doctorModel
      .deleteMany({})
      .then(() => {
        createdFiles.forEach((file) => {
          fs.unlinkSync(file, (err) => done(err));
        });
        return done();
      })
      .catch(done);
  });

  it("Can't GET /psy/doctors/profile without token", (done) => {
    chai
      .request(server)
      .get('/psy/doctors/profile')
      .then((res) => {
        res.should.have.status(500);
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
});
