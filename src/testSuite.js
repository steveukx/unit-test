var TestCase = require('./testCase');
var Path = require('path');
var Q = require('q');

function onTestSuiteComplete(result) {
    console.log('===============================');
    console.log('=== Processed ' + result.tests + ' tests, ' + result.errors + ' failed');
    console.log('=== in ' + result.duration + 'ms');
    console.log('===============================');
    console.log('=== ' + (result.errors > 0 ? 'ERROR' : 'SUCCESSFUL'));
    console.log('===============================');
}

function runTestSuite(paths, onDone) {
    if (!Array.isArray(paths)) {
        throw new TypeError('Paths supplied to test suite must be an array.');
    }

    var start = Date.now();
    var tests = 0;
    var errors = 0;
    var testChain = Q.resolve();

    paths.forEach(function(testClass) {
        var suite = require(testClass);
        var testCase = (suite instanceof TestCase) ? suite : new TestCase(Path.basename(testClass), suite);

        testChain = testChain.then(function() {
            var deferred = Q.defer();
            testCase.runTests(function(results) {
                console.log('===============================');
                console.log(testCase.name + ': ' + results.length + ' ran, ' + results.filter(function(res) {
                    return res.result
                }).length + ' passed');

                results.forEach(function(result) {
                    tests++;
                    if (!result.result) {
                        errors++;
                        console.log(result.name, result.error);
                    }
                });

                deferred.resolve();
            });
            return deferred.promise;
        });
    });

    testChain.then(function() {
        (onDone || onTestSuiteComplete)({
            tests: tests,
            errors: errors,
            duration: Date.now() - start
        });
    });
}

module.exports = {
    /**
     * Runs tests in the named files. Optional trailing callback parameter to be used as a handler for when the
     * tests are complete.
     *
     * @param {string} ...path
     * @param {Function} [callback]
     */
    namedFiles: function(path/* , path ... */) {
        var callback;
        var paths = [].slice.call(arguments, 0);
        if (typeof paths[paths.length - 1] === "function") {
            callback = paths.pop();
        }

        runTestSuite(paths, callback);
    },

    /**
     * Runs tests in the files found by scanning the supplied basePath directory (recursively) for files that match
     * the ant style patterns supplied in the paths array. Optional callback parameter to be used as a handler for
     * when the tests are complete.
     *
     * @param {string} basePath
     * @param {string[]} paths
     * @param {Function} [callback]
     */
    paths: function(basePath, paths, callback) {
        var readDir = require('readdir');
        runTestSuite(readDir.readSync(basePath, paths, readDir.ABSOLUTE_PATHS), callback);
    }
};

