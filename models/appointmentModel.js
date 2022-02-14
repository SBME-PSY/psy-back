const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
  },
  PaymentStatus: {
    type: Boolean,
    default: false,
  },
  appointmentStatus: {
    type: String,
    enum: ['waiting', 'attended', 'canceled', 'missed'],
    default: 'waiting',
  },
});
const appointmentModel = mongoose.model('Appointment', appointmentSchema);
module.exports = appointmentModel;
