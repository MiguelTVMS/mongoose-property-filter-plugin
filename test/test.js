/* global describe it before */
const assert = require('assert');
const util = require('util')
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

                    assert.equal(jsonDoc.hasOwnProperty('_shouldHide'), false, 'The property _shouldHide was not removed.');
                    assert.equal(jsonDoc.hasOwnProperty('deleted'), false, 'The property deleted was not removed.');
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

                //console.log(util.format('Object: %j', obj));

                const schema = new MultiLevel(obj);

                //console.log(util.format('Schema: %j', schema));

                return schema.save().then((doc) => {
                    const jsonDoc = doc.toJSON();

                    //console.log(util.format('JSON: %j', jsonDoc));

                    assert.equal(jsonDoc.hasOwnProperty('_shouldHide'), false, 'The property _shouldHide was not removed.');
                    assert.equal(jsonDoc.hasOwnProperty('deleted'), false, 'The property deleted was not removed.');

                    assert.equal(jsonDoc.sub.hasOwnProperty('_shouldHide'), false, 'The property _shouldHide was not removed from the sub object.');
                    assert.equal(jsonDoc.sub.hasOwnProperty('deleted'), false, 'The property deleted was not removed from the sub object.');
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

                    //console.log(util.format('JSON: %j', jsonDoc));

                    assert.equal(jsonDoc.hasOwnProperty('_shouldHide'), false, 'The property _shouldHide was not removed.');
                    assert.equal(jsonDoc.hasOwnProperty('deleted'), false, 'The property deleted was not removed.');

                    assert.equal(jsonDoc.sub.hasOwnProperty('_shouldHide'), true, 'The property _shouldHide was removed from the sub object.');
                    assert.equal(jsonDoc.sub.hasOwnProperty('deleted'), true, 'The property deleted was removed from the sub object.');
                });
            });
        });
    });
});
