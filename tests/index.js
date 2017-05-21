const assert = require('assert');


function testSchema() {

    const schema = require("./schema");

    assert.equal(schema.modelName, "Client", "Failed to create a schema using the filter.");

}

testSchema();
process.exit(0);
