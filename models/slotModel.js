const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'a doctor is required'],
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'a clinic is required'],
  },
  from: {
    type: Date,
    required: [true, 'a slot from is required'],
    validate: {
      validator: function (val) {
        return val >= Date.now() && val - Date.now() < 604800000; //6048000000 =7 days
      },
      message: `time slot should be in the future and within 7 days on maximum `,
    },
  },
  to: {
    type: Date,
    required: [true, `a slot to is required `],
    validate: {
      validator: function (val) {
        return val >= Date.now() && val - this.from >= 900000; //900000 ms = 15 minutes
      },
      message: `time slot should be more than 15 mintues in the future `,
    },
  },

  reserved: {
    type: Boolean,
    default: false,
  },
});
const slotModel = mongoose.model('Slot', slotSchema);

module.exports = slotModel;
