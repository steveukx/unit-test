
var UnitTest = require('../src/unit-test');

module.exports = {

    'test will wait for long running cases before moving on': function (next) {
        UnitTest.Suite.namedFiles(__dirname + '/examples/slowTest', __dirname + '/examples/slowTest', function (done) {
            next(done.errors ? new Error("Failed") : null);
        });
    }

};
