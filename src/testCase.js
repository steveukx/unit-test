/**
 * @class
 */
var TestCase = (function (TestResult) {

   "use strict";

   /**
    *
    * @constructor
    * @name TestCase
    */
   function TestCase(testCaseName, tests) {
      this.name = testCaseName;
      if(typeof tests == 'function') {
         this._tests = tests();
      }
      else if(typeof tests == 'object') {
         this._tests = tests;
      }

      if(!this._tests || typeof this._tests != 'object') {
         throw new Error('TestCase: cannot construct a test case without a tests map');
      }
   }

   TestCase.prototype.runTests = function(resultCallback) {
      var results = [];

      for(var test in this._tests) {
         if(test.match(/^test/) && this._tests.hasOwnProperty(test)) {
            this.setUp();
            try {
               this._tests[test]();
               results.push(TestResult.success(test.replace(/^test/, '')));
            }
            catch(e) {
               results.push(TestResult.error(test.replace(/^test/, ''), e));
            }
            finally {
               this.tearDown();
            }
         }
      }

      resultCallback(results);
   };

   TestCase.prototype.setUp = function() {
      if(typeof this._tests.setUp == 'function') {
         this._tests.setUp();
      }
   };

   TestCase.prototype.tearDown = function() {
      if(typeof this._tests.tearDown == 'function') {
         this._tests.tearDown();
      }
   };

   return TestCase;

}(require('./testResult.js')));

if(typeof module != 'undefined') {
   module.exports = TestCase;
}
