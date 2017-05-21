# mongoose-property-filter-plugin
Mongoose plugin to easly remove properties from the schema without removing any data.

## Status status

| master | develop | version |
|:---:|:---:|:---:|
|[![Build Status](https://travis-ci.org/jmtvms/express-property-filter-plugin.svg?branch=master)](https://travis-ci.org/jmtvms/express-property-filter-plugin)|[![Build Status](https://travis-ci.org/jmtvms/express-property-filter-plugin.svg?branch=develop)](https://travis-ci.org/jmtvms/express-property-filter-plugin)|[![npm version](https://badge.fury.io/js/mongoose-property-filter-plugin.svg)](https://badge.fury.io/js/mongoose-property-filter-plugin)|
## How to use it
To use this module just add the reference to you javascript file.

```javascript
const mongoosePropertyFilter = require('mongoose-property-filter');
```

Then just add the plugin on the shcema app.

```javascript
const clientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Client name is mandatory']
    }
});

clientSchema.plugin(mongoosePropertyFilter);
```

## Configuring

You can configure the toJSON and toObject methods output properties filter from your schema using regex ``` /(_|deleted|created|updated).*/ ```, a whitespace separed string ``` "_id __v createdAt updatedAt deleted deletedAt deletedBy" ``` or even an array of strings ``` ["_id", "__v", "createdAt", "updatedAt", "deleted", "deletedAt, "deletedBy"] ```.

### Options available and their default values

|    Property   |            Type           |             Default             |                                                                         Description                                                                        |
|:-------------:|:-------------------------:|:-------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| **hide**          | Regexp, String, [String] | /(_\|deleted\|created\|updated).\*/ | Fields to be removed from the schema. |
| **showVirtuals**  |            Bool           |               true              | Force virtual fields to be shown.                                                                                                                          |
| **versionKey**    |            Bool           |              false              | Show the version key from the schema.                                                                                                                      |
| **_id**           |            Bool           |              false              | Show the _id field from the schema.                                                                                                                        |
| **applyToJSON**   |            Bool           |               true              | Should the filters be applied on the toJSON method from the schema.                                                                                        |
| **applyToObject** |            Bool           |              false              | Should the filters be applied on the toObject method from the schema.                                                                                      |
### Using the options on your schema



```javascript
const clientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Client name is mandatory']
    },
    myCustomField: {
        type: String,
    }
});

// With this options the JSON version of this schema will be { "name" : "Wally" }
const opt = { "hide" : "myCustomField" };
clientSchema.plugin(mongoosePropertyFilter, opt);
```