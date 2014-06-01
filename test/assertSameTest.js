
var Assert = require('assert');
var unitTestAssertions = require('../src/assert');

var assertions = {
   valid: [
       [{some: "thing"}, {some: "thing"}], // simple object
       [{some: { thing: "complex" }}, {some: { thing: "complex" }}], // nested objects
       [123, 123], // numbers
       [10e6, 10000000], // numbers with notation
       [NaN, NaN], // not numbers
       [NaN, 100 * "Blah"], // they're still not numbers
       [null, null], // nulls are equal objects
       [new Date(2010, 0, 1), new Date(2010, 0, 1)], // dates
       ["Strings", "Strings"] // strings
   ],
   invalid: [
       [+new Date(2010, 0, 1), new Date(2010, 0, 1)], // type mismatch
       [{}, {extra: 'property'}], // extra properties
       [{missing: 'property'}, {}] // missing properties
   ]
};

module.exports = {
    'test valid similarities': function () {
        assertions.valid.forEach(function (assertion) {
            Assert.doesNotThrow(function () {
                unitTestAssertions.assertSame(assertion[0], assertion[1]);
            });
        });
    },

    'test invalid similarities': function () {
        assertions.invalid.forEach(function (assertion) {
            Assert.throws(function () {
                unitTestAssertions.assertSame(assertion[0], assertion[1]);
            });
        });
    }
};

