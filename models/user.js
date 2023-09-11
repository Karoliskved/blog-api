const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  poster: { type: Boolean, required: true },
  admin: { type: Boolean, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

UserSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
