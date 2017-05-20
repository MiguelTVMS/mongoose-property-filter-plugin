function defaultOptions(options) {
    options = options || {};

    if (!options.hide)
        options.hide = /(_|deleted|created|updated).*/;

    if (!options.showVirtuals)
        options.showVirtuals = false;

    if (!options.versionKey)
        options.versionKey = false;

    if (!options._id)
        options._id = false;

    if (!options.applyToJSON)
        options.applyToJSON = true;

    if (!options.applyToObject)
        options.applyToObject = false;

    return options;
}

function filter(doc, ret, opt, transformOptions) {

    if (transformOptions.hide instanceof RegExp) {
        const props = Object.keys(ret);
        props.forEach(prop => {
            if (transformOptions.hide.test(prop)) delete ret[prop];
        });
        return;
    }

    if (!Array.isArray(transformOptions.hide)) {
        transformOptions.hide = transformOptions.hide.split(' ');
        return;
    }

    if (transformOptions.hide) {
        transformOptions.hide.forEach(prop => delete ret[prop]);
        return;
    }
};

var removeFields = function (schema, options) {

    transformOptions = defaultOptions(options);

    if (transformOptions.applyToJSON)
        schema.options.toJSON = {
            _id: transformOptions._id,
            versionKey: transformOptions.versionKey,
            virtuals: transformOptions.showVirtuals,
            transform: (doc, ret, opt) => filter(doc, ret, opt, transformOptions)
        };

    if (transformOptions.applyToObject)
        schema.options.toObject = {
            _id: transformOptions._id,
            versionKey: transformOptions.versionKey,
            virtuals: transformOptions.showVirtuals,
            transform: (doc, ret, opt) => filter(doc, ret, opt, transformOptions)
        };
};

module.exports = exports = removeFields;
