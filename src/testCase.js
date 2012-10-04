/**
 * @class
 */
var TestCase = (function () {

   "use strict";

   var SyncTest = require('./syncTest.js');

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

   /**
    *
    * @return {Test[]}
    */
   TestCase.prototype._buildTests = function() {
      var stack = [];
      for(var testName in this._tests) {
         if(testName.match(/^test/) && this._tests.hasOwnProperty(testName)) {
            var test = this._tests[testName];
            if(typeof test == 'function') {
               stack.push(new SyncTest(test).withName(testName.replace(/^test(\s*)/, '')));
            }
            else if(test && typeof test.run == 'function') {
               if(test.withName) {
                  test.withName(testName.replace(/^test(\s*)/, ''));
               }
               stack.push(test);
            }
            else {
               throw new ReferenceError('TestCase cannot prepare a test where it is neither a function nor a Test instance');
            }
         }
      }
      return stack;
   };

   /**
    * Runs all tests in this TestCase
    * @param {Function} resultCallback
    */
   TestCase.prototype.runTests = function(resultCallback) {
      this._results = [];
      this._stack = this._buildTests();
      this._onDone = resultCallback;

      this._runNextTest();
   };

   /**
    * Schedules the next test to be run, or sends the results back to the done handler
    */
   TestCase.prototype._runNextTest = function() {
      var test = this._stack.shift();
      if(test) {
         this.setUp();
         test.run(this._onTestDone.bind(this));
      }
      else {
         this._onDone(this._results);
      }
   };

   /**
    *
    */
   TestCase.prototype._onTestDone = function(testResult) {
      this._results.push(testResult);
      this.tearDown();
      this._runNextTest();
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

}());

if(typeof module != 'undefined') {
   module.exports = TestCase;
}
