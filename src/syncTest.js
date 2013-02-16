/**
 * @class
 */
var SyncTest = (function () {

   "use strict";

   var TestResult = require('./testResult.js');

   /**
    *
    * @constructor
    * @name SyncTest
    */
   function SyncTest(test) {
      if(typeof test !== 'function') {
         throw new ReferenceError('SyncTest requires that the supplied test is a callable function');
      }
      this._test = test;
   }

   /**
    * Sets the name of the test
    * @param {String} name
    */
   SyncTest.prototype.withName = function(name) {
      this._name = name;
      return this;
   };

   /**
    * Start running the test, the supplied callback will be called with a TestResult. When the test has an arity of one,
    * it is assumed to be an asynchronous test that will call the supplied argument as a function with an error, a
    * function that should be called to get the actual assertions of the test or a falsy value to indicate that no
    * errors occurred.
    *
    * @param {Function} resultCallback
    * @param {Function} [testFn] Ordinarily omitted, but can be supplied to run nested tests in the case that the
    *                            test returns a function that is the actual test suite to be run.
    */
   SyncTest.prototype.run = function(resultCallback, testFn) {
      var testName = this._name,
         self = this,
         test = testFn || this._test;

      try {
         if(test.length === 1) {
            test(function(err) {
               if(typeof err === "function") {
                  self.run(resultCallback, err);
               }
               else if(err) {
                  resultCallback(TestResult.error(testName, e));
               }
               else {
                  resultCallback(TestResult.success(testName));
               }
            });
         }
         else {
            test();
            resultCallback(TestResult.success(testName));
         }
      }
      catch(e) {
         resultCallback(TestResult.error(testName, e));
      }
   };

   return SyncTest;

}());

if(typeof module != 'undefined') {
   module.exports = SyncTest;
}
