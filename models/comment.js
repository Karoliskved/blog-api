const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: { type: String, required: true, maxLength: 5000 },
  timestamp: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectID, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
});

commentSchema.virtual('timestamp_formatted').get(function () {
  return this.timestamp
    ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_FULL)
    : '';
});
commentSchema.virtual('url').get(function () {
  return `/comment/${this._id}`;
});

module.exports = mongoose.model('Comment', commentSchema);
