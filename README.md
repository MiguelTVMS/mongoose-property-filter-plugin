# express-property-filter-plugin
Express plugin to easly remove properties from the schema without removing any data.
## How to use it
To use this module just add the reference to you javascript file.

```javascript
const expressPropertyFilter = require('express-property-filter');
```

Then just add the plugin on the shcema app.

```javascript
const clientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Client name is mandatory']
    }
});

clientSchema.plugin(expressPropertyFilter);
```

## Configuring

You can configure the toJSON and toObject methods output properties filter from your schema using regex ``` /(_|deleted|created|updated).*/ ```, a whitespace separed string ``` "_id __v createdAt updatedAt deleted deletedAt deletedBy" ``` or even an array of strings ``` ["_id", "__v", "createdAt", "updatedAt", "deleted", "deletedAt, "deletedBy"] ```.

### Options available and their default values

|    Property   |            Type           |             Default             |                                                                         Description                                                                        |
|:-------------:|:-------------------------:|:-------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| **hide**          | Regexp  String   [String] | /(_\|deleted\|created\|updated).\*/ | Fields to be removed from the schema. |
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
clientSchema.plugin(expressPropertyFilter, opt);
```


## Version history.

### 1.0.0
 - First functional version of this plugin.