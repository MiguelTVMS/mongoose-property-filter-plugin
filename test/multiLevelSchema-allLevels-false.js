const mongoosePropertyFilter = require('../index');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const singleLevelSchema = new Schema({
    _shouldHide: String,
    shouldAppear: String,
    deleted: Boolean
});

const multiLevelSchema = new Schema({
    _shouldHide: String,
    shouldAppear: String,
    deleted: Boolean,
    sub: singleLevelSchema
});

multiLevelSchema.plugin(mongoosePropertyFilter, { allLevels: false });

module.exports = mongoose.model('MultiLevelOff', multiLevelSchema);
