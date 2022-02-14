const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  doctor: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Doctor',
    required: [true, 'a doctor is required'],
  },
  address: {
    type: String,
    required: [true, 'an address is required'],
  },
  pictures: {
    type: [String],
  },
  rating: {
    type: Number,
    max: 5,
    min: 0,
  },
  phoneNumber: {
    type: [String],
    maxLength: [13, 'the phone nuber is too long'],
    minLength: [11, 'the phone nuber is too short'],
    match: [/^(\+2)?01[0-25]\d{8}$/, 'Please add a valid phone number'],
    required: [true, 'a phone number is required'],
    unique: true,
  },
  price: {
    type: Number,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
    required: [true, 'a price is required'],
  },
});

const clinicModel = mongoose.model('Clinic', clinicSchema);
module.exports = clinicModel;
