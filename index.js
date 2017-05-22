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

function filter(doc, ret, opt) {

    if (opt.hide instanceof RegExp) {
        const props = Object.keys(ret);
        props.forEach(prop => {
            if (opt.hide.test(prop)) delete ret[prop];
        });
        return;
    }

    if (!Array.isArray(opt.hide)) {
        opt.hide = opt.hide.split(' ');
        return;
    }

    if (opt.hide) {
        opt.hide.forEach(prop => delete ret[prop]);
        return;
    }
};

var removeFields = function (schema, options) {

    const transformOptions = defaultOptions(options);

    if (transformOptions.applyToJSON)
        schema.options.toJSON = {
            _id: transformOptions._id,
            versionKey: transformOptions.versionKey,
            virtuals: transformOptions.showVirtuals,
            hide: transformOptions.hide,
            transform: (doc, ret, opt) => filter(doc, ret, opt)
        };

    if (transformOptions.applyToObject)
        schema.options.toObject = {
            _id: transformOptions._id,
            versionKey: transformOptions.versionKey,
            virtuals: transformOptions.showVirtuals,
            hide: transformOptions.hide,
            transform: (doc, ret, opt) => filter(doc, ret, opt)
        };
};

module.exports = exports = removeFields;
