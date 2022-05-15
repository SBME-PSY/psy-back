const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
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
    phoneNumbers: {
      type: [String],
      maxLength: [13, 'the phone nuber is too long'],
      minLength: [11, 'the phone nuber is too short'],
      validate: {
        validator: function (value) {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < value.length; i++) {
            if (
              !value[i].match(/^(\+2)?01[0-25]\d{8}$/) &&
              !value[i].match(/^02\d{8}$/)
            ) {
              return false;
            }
          }

          return true;
        },
        message:
          'please add avalid number 02xxxxxxxx for lan or  010 011 012 015xxxxxxxx for phone number ',
      },
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
clinicSchema.virtual('slots', {
  ref: 'Slot',
  localField: '_id',
  foreignField: 'clinicId',
});

clinicSchema.pre(/^find/, function (next) {
  this.populate('slots');
  next();
});
const clinicModel = mongoose.model('Clinic', clinicSchema);
module.exports = clinicModel;
