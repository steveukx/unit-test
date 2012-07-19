
function runTestSuite(paths) {
   if(!Array.isArray(paths)) {
      throw new TypeError('Paths supplied to test suite must be an array.');
   }

   var start = Date.now();
   var tests = 0;

   paths.forEach(function(testClass) {
      var suite = require('./' + testClass);
      console.log('===============================');
      console.log(testClass);
      var padding = new Array(6 /*testClass.length*/).join(' ');
      for(var property in suite) {
         if(/^test/.test(property)) {
            console.log(padding + '.' + property.substr(4));
            if(suite.setUp) suite.setUp();
            suite[property]();
            if(suite.tearDown) suite.tearDown();
            tests++;
         }
      }
   });

   console.log('===============================');
   console.log('=== Processed ' + tests + ' tests');
   console.log('=== in ' + (Date.now() - start) + 'ms');
   console.log('===============================');
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

