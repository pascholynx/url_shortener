const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
 firstname: {
  type: String,
  required: true
 },
 lastname: {
  type: String,
  required: true
 },
 username: {
  type: String,
  required: true
 },
 email: {
  type: String,
  required: true,
  unique: true
 },
 password: {
 type: String,
 required: true
 }
});

// Hash the user's password before saving it
userSchema.pre('save', async function (next) {
 if (!this.isModified('password')) {
  return next();
 }

 try {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
 } catch (err) {
  return next(err);
 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
