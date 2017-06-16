const debuglog = require('util').debuglog('mongoose-property-filter-plugin');

function defaultOptions(options) {
    options = options || {};

    if (!options.hide) {
        options.hide = /(_|deleted|created|updated).*/;
        debuglog('options.hide not set, using default: %s', options.hide);
    } else {
        debuglog('Using passed options.hide: %s', options.hide);
    }

    if (!options.showVirtuals) {
        options.showVirtuals = false;
        debuglog('options.showVirtuals not set, using default: %s', options.showVirtuals);
    } else {
        debuglog('Using passed options.showVirtuals: %s', options.showVirtuals);
    }

    if (!options.versionKey) {
        options.versionKey = false;
        debuglog('options.versionKey not set, using default: %s', options.versionKey);
    } else {
        debuglog('Using passed options.versionKey: %s', options.versionKey);
    }

    if (!options._id) {
        options._id = false;
        debuglog('options._id not set, using default: %s', options._id);
    } else {
        debuglog('Using passed options._id: %s', options._id);
    }

    if (!options.applyToJSON) {
        options.applyToJSON = true;
        debuglog('options.applyToJSON not set, using default: %s', options.applyToJSON);
    } else {
        debuglog('Using passed options.applyToJSON: %s', options.applyToJSON);
    }

    if (!options.applyToObject) {
        options.applyToObject = false;
        debuglog('options.applyToObject not set, using default: %s', options.applyToObject);
    } else {
        debuglog('Using passed options.applyToObject: %s', options.applyToObject);
    }

    if (typeof options.allLevels === 'undefined') {
        options.allLevels = true;
        debuglog('options.allLevels not set, using default: %s', options.allLevels);
    } else {
        debuglog('Using passed options.allLevels: %s', options.allLevels);
    }

    return options;
}

function removeByRegex(obj, regex, allLevels) {
    debuglog('Removing properties by the regex "%s" from the object: %j', regex, obj);
    if (typeof obj === 'undefined' || obj === null) return;
    const props = Object.keys(obj);
    props.forEach((prop) => {
        if (regex.test(prop)) delete obj[prop];
        const propType = typeof (obj[prop]);
        if (propType === 'object' && allLevels) removeByRegex(obj[prop], regex, allLevels);
    });
}

function removeByName(obj, names, allLevels) {
    debuglog('Removing properties by the names "%s" from the object: %j', names.join(), obj);
    if (typeof obj === 'undefined' || obj === null) return;
    names.forEach(prop => delete obj[prop]);
    if (allLevels) {
        const props = Object.keys(obj);
        props.forEach((prop) => {
            const propType = typeof (obj[prop]);
            if (propType === 'object') removeByName(obj[prop], names, allLevels);
        });
    }
}

function filter(doc, ret, opt) {

    if (opt.hide instanceof RegExp) {
        removeByRegex(ret, opt.hide, opt.allLevels);
        return;
    }

    if (!Array.isArray(opt.hide)) {
        opt.hide = opt.hide.split(' ');
        return;
    }

    if (opt.hide) {
        removeByName(ret, opt.hide, opt.allLevels);
    }
}

const propertyFilter = function (schema, options) {

    const transformOptions = defaultOptions(options);
    debuglog('Using with the following options: %j', options);

    if (transformOptions.applyToJSON) {
        schema.options.toJSON = {
            _id: transformOptions._id,
            versionKey: transformOptions.versionKey,
            virtuals: transformOptions.showVirtuals,
            hide: transformOptions.hide,
            allLevels: transformOptions.allLevels,
            transform: (doc, ret, opt) => filter(doc, ret, opt)
        };
        debuglog('Configuring the toJSON method with options: %j', schema.options.toJSON);
    }

    if (transformOptions.applyToObject) {
        schema.options.toObject = {
            _id: transformOptions._id,
            versionKey: transformOptions.versionKey,
            virtuals: transformOptions.showVirtuals,
            hide: transformOptions.hide,
            allLevels: transformOptions.allLevels,
            transform: (doc, ret, opt) => filter(doc, ret, opt)
        };
        debuglog('Configuring the applyToObject method with options: %j', schema.options.applyToObject);
    }
};

module.exports = propertyFilter;
