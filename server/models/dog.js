/* eslint-disable no-use-before-define, func-names */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String,
          required: true,
          minlength: 3,
          validate: { validator: duplicateDogNameValidator } },
  age: { type: Number },
  health: { type: Number, min: 0, max: 100 },
  toy: { type: String, enum: ['Bones', 'Frisbee'] },
  dateCreated: { type: Date, default: Date.now },
});

schema.methods.feed = function (cb) {
  this.health = this.health > 90 ? 100 : this.health + 10;
  this.save(cb);
};

function duplicateDogNameValidator(name, cb) {
  this.model('Dog').find({ name }, (err, dogs) => {
    cb(!dogs.length);
  });
}

module.exports = mongoose.model('Dog', schema);
