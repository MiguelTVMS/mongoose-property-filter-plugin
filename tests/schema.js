const mongoosePropertyFilter = require("../index");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Client name is mandatory']
    },
    myCustomField: {
        type: String,
    }
});

const opt = { "hide": "myCustomField" };
clientSchema.plugin(mongoosePropertyFilter, opt);

module.exports = mongoose.model('Client', clientSchema);
