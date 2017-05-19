module.exports = exports = function removeFields(schema, options) {

    options = options || {};

    if (!options.filter)
        options.filter = "(_|deleted|created|updated).*";

    if (!options.showVirtuals)
        options.showVirtuals = false;

    schema.options.toJSON = {
        _id: false,
        versionKey: false,
        virtuals: options.showVirtuals,
        transform: (doc, ret, opt) => {

            const propNames = Object.keys(ret);
            var toRemove = new RegExp(options.filter);

            propNames.forEach((element) => {
                if (toRemove.test(element)) delete ret[element];
            }, this);
        }
    };
}
