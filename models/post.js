const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectID, ref: 'User', required: true },
  published: { type: Boolean, required: true },
});

postSchema.virtual('timestamp_formatted').get(function () {
  return this.timestamp
    ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_FULL)
    : '';
});
postSchema.virtual('url').get(function () {
  return `/post/${this._id}`;
});

module.exports = mongoose.model('Post', postSchema);
