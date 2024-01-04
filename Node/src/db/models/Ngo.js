const mongoose = require('mongoose');

const NgoSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  pocName: { type: String, required: true },
  ngoCol: { type: String, required: true },
}, { timestamps: true }
);

module.exports = mongoose.model('NGO', NgoSchema);