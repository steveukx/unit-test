
var TestCase = require('./testCase');

function testSuiteComplete(start, tests, errors) {
   console.log('===============================');
   console.log('=== Processed ' + tests + ' tests, ' + errors + ' failed');
   console.log('=== in ' + (Date.now() - start) + 'ms');
   console.log('===============================');
   console.log('=== ' + (errors > 0 ? 'ERROR' : 'SUCCESSFUL'));
   console.log('===============================');
}


function runTestSuite(paths) {
   if(!Array.isArray(paths)) {
      throw new TypeError('Paths supplied to test suite must be an array.');
   }

   var start = Date.now();
   var tests = 0;
   var errors = 0;
   var testCasesPending = paths.length;

   paths.forEach(function(testClass) {
      var suite = require(testClass);
      var testCase = (suite instanceof TestCase) ? suite : new TestCase(testClass, suite);

      testCase.runTests(function(results) {
         console.log('===============================');
         console.log(testCase.name + ': ' + results.length + ' ran, ' + results.filter(function(res) {return res.result}).length + ' passed');

         results.forEach(function(result) {
            tests++;
            if(!result.result) {
               errors++;
               console.log(result.name, result.error);
            }
         });

         if(!--testCasesPending) {
            testSuiteComplete(start, tests, errors);
         }
      })
   });
}

module.exports = {
   namedFiles: function(path/* , path ... */) {
      runTestSuite([].slice.call(arguments, 0));
   },
   paths: function(basePath, paths) {
      var readDir = require('readdir');
      runTestSuite(readDir.readSync(basePath, paths, readDir.ABSOLUTE_PATHS));
   }
};

