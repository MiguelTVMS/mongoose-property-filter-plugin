/* global describe it before */
const rewire = require('rewire');
const rwIndex = rewire('../index');
const expect = require('chai').expect;
const util = require('util');
const debuglog = util.debuglog('mongoose-property-filter-plugin');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = bluebird;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const SingleLevel = require('./singleLevelSchema');
const MultiLevel = require('./multiLevelSchema');
const MultiLevelOff = require('./multiLevelSchema-allLevels-false');

before((done) => {
    mockgoose.prepareStorage().then(() => {
        mongoose.connect('mongodb://example.com/mockdb', (err) => {
            done(err);
        });
    });
});

describe('Stand alone', () => {
    describe('Private functions', () => {
        it('removeByRegex should handle undefined or null objects.', () => {
            const removeByRegex = rwIndex.__get__('removeByRegex');

            const undefObj = undefined;

            removeByRegex(undefObj, /(_|deleted|created|updated).*/, true);

        });
        it('removeByName should handle undefined or null objects.', () => {
            const removeByName = rwIndex.__get__('removeByName');

            const undefObj = undefined;

            removeByName(undefObj, ['_id', 'deleted'], true);
        });
        it('defaultOptions should set the expexted default options.', () => {

            const options = {};

            const defaultOptions = rwIndex.__get__('defaultOptions');
            defaultOptions(options);

            expect(options)
                .to.have.property('hide').to.be.an('RegExp');

            expect(options)
                .to.own.include({
                    //hide: /(_|deleted|created|updated).*/, //Regex is not supported.
                    showVirtuals: false,
                    showGetters: false,
                    versionKey: false,
                    _id: false,
                    applyToJSON: true,
                    applyToObject: false,
                    allLevels: true
                });

        });
        it('filter should work with a regex.', () => {
            const obj = {
                _shouldHide: 'String',
                shouldAppear: 'String',
                deleted: false
            };

            const options = {
                hide: /(_|deleted|created|updated).*/
            };
            const defaultOptions = rwIndex.__get__('defaultOptions');
            defaultOptions(options);
            const filter = rwIndex.__get__('filter');

            filter(null, obj, options);

            expect(obj)
                .to.have.property('shouldAppear')
                .but.not.to.have.all.keys('_shouldHide', 'deleted');

        });
        it('filter should work with a array of strings.', () => {
            const obj = {
                _shouldHide: 'String',
                shouldAppear: 'String',
                deleted: false
            };

            const options = {
                hide: ['_shouldHide', 'deleted']
            };
            const defaultOptions = rwIndex.__get__('defaultOptions');
            defaultOptions(options);
            const filter = rwIndex.__get__('filter');

            filter(null, obj, options);

            expect(obj)
                .to.have.property('shouldAppear')
                .but.not.to.have.all.keys('_shouldHide', 'deleted');
        });
        it('filter should work with a string separated by spaces', () => {
            const obj = {
                _shouldHide: 'String',
                shouldAppear: 'String',
                deleted: false
            };

            const options = {
                hide: '_shouldHide deleted'
            };
            const defaultOptions = rwIndex.__get__('defaultOptions');
            defaultOptions(options);
            const filter = rwIndex.__get__('filter');

            filter(null, obj, options);

            expect(obj)
                .to.have.property('shouldAppear')
                .but.not.to.have.all.keys('_shouldHide', 'deleted');
        });
    });
});

describe('Schema', () => {
    describe('Default options', () => {
        describe('Single level schema', () => {
            it('Should hide the properties "_shouldHide" and "delete" on the toJSON', () => {

                const obj = {
                    _shouldHide: 'String',
                    shouldAppear: 'String',
                    deleted: false
                };

                const schema = new SingleLevel(obj);

                return schema.save().then((doc) => {
                    const jsonDoc = doc.toJSON();

                    expect(jsonDoc)
                        .to.have.property('shouldAppear')
                        .but.not.to.have.all.keys('_shouldHide', 'deleted');
                });
            });
        });
        describe('Multiple levels schema', () => {
            it('Should hide the properties "_shouldHide" and "delete" from the main and sub objects on the toJSON.', () => {

                const obj = {
                    _shouldHide: 'String',
                    shouldAppear: 'String',
                    deleted: false
                };

                obj.sub = {
                    _shouldHide: 'String',
                    shouldAppear: 'String',
                    deleted: false
                };

                debuglog('Object: %j', obj);

                const schema = new MultiLevel(obj);

                debuglog('Schema: %j', schema);

                return schema.save().then((doc) => {
                    const jsonDoc = doc.toJSON();

                    debuglog('JSON: %j', jsonDoc);

                    expect(jsonDoc)
                        .to.have.property('shouldAppear')
                        .but.not.to.have.all.keys('_shouldHide', 'deleted');

                    expect(jsonDoc.sub)
                        .to.have.property('shouldAppear')
                        .but.not.to.have.all.keys('_shouldHide', 'deleted');
                });
            });
        });
    });
    describe('AllLevels disabled', () => {
        describe('Multiple levels schema', () => {
            it('Should hide the properties "_shouldHide" and "delete" only from the main object on the toJSON.', () => {

                const obj = {
                    _shouldHide: 'String',
                    shouldAppear: 'String',
                    deleted: false
                };

                obj.sub = {
                    _shouldHide: 'String',
                    shouldAppear: 'String',
                    deleted: false
                };

                const schema = new MultiLevelOff(obj);

                return schema.save().then((doc) => {
                    const jsonDoc = doc.toJSON();

                    debuglog('JSON: %j', jsonDoc);

                    expect(jsonDoc)
                        .to.have.property('shouldAppear')
                        .but.not.to.have.all.keys('_shouldHide', 'deleted');

                    expect(jsonDoc.sub)
                        .to.have.all.keys('_id', '_shouldHide', 'shouldAppear', 'deleted');
                });
            });
        });
    });
});
