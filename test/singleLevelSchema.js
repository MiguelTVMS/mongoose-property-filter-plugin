const mongoosePropertyFilter = require('../index');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const singleLevelSchema = new Schema({
    _shouldHide: String,
    shouldAppear: String,
    deleted: Boolean
});

singleLevelSchema.plugin(mongoosePropertyFilter);

module.exports = mongoose.model('SingleLevel', singleLevelSchema);
