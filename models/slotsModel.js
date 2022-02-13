const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  doctorid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'a doctor is required'],
  },
  clinicid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'a clinic is required'],
  },
  timeSlot: {
    type: Date,
    required: [true, 'a slot is required'],
  },
  duration: {
    type: Number,
    required: [true, 'a duration is required'],
  },
  reserved: {
    type: Boolean,
    default: false,
  },
});

const slotModel = mongoose.model('Slot', slotSchema);
module.exports = slotModel;
