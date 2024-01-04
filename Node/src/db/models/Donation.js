const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const MedicineSchema = Schema({
  brandName: { type: String, required: true },
  genericName: { type: String },
  medicineType: { type: String, required: true },
  expiryDate: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  imageUrl: { type: String, default: null },
  quantity: { type: Number, required: true },
  report: {
    reported: { type: String, default: 'no' },
    action: { type: String, default: null },
    message: { type: String, default: null }
  },
  userType: { type: String, required: true, enum: ['user', 'ngo'] },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  ngoId: { type: Schema.Types.ObjectId, ref: 'NGO' },
  status: { type: String, default: 'pending', enum: ['pending', 'completed'] },

}, { timestamps: true }
);

module.exports = Mongoose.model('Donation', MedicineSchema);