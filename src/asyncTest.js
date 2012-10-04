/**
 * @class
 */
var AsyncTest = (function () {

   "use strict";

   var TestResult = require('./testResult.js');

   /**
    *
    * @constructor
    * @name AsyncTest
    */
   function AsyncTest(test, setUp, tearDown) {
      if(typeof test !== 'function') {
         throw new ReferenceError('AsyncTest requires that the supplied test is a callable function');
      }

      this._test = test;
      this._phases = [
         (typeof setUp == 'function') && setUp,
         test,
         (typeof tearDown == 'function') && tearDown
      ].filter(function(callback){ return !!callback });
   }

   /**
    *
    * @type {null}
    */
   AsyncTest.prototype._phases = null;

   /**
    *
    * @type {TestResult}
    */
   AsyncTest.prototype._result = null;

   /**
    * Sets the name of the test
    * @param {String} name
    */
   AsyncTest.prototype.withName = function(name) {
      this._name = name;
      return this;
   };

   /**
    * Start running the test
    * @param  resultCallback
    */
   AsyncTest.prototype.run = function(resultCallback) {
      this._onDone = resultCallback;
      this._next();
   };

   /**
    * Move the processing on one step
    */
   AsyncTest.prototype._next = function() {
      var fn = this._phases.shift();
      if(!!fn) {
         if(fn === this._test) {
            this._runTest(fn);
         }
         else {
            this._runWrapper(fn);
         }
      }

      else {
         this._onDone(this._result);
      }
   };

   /**
    * Runs either a setUp or tearDown function
    * @param {Function} wrapperFn
    */
   AsyncTest.prototype._runWrapper = function(wrapperFn) {
      if(wrapperFn.length) {
         wrapperFn(this._next.bind(this));
      }
      else {
         wrapperFn();
         this._next();
      }
   };

   /**
    * Runs the main test function, caching the TestResult onto the test instance
    * @param {Function} testFn
    */
   AsyncTest.prototype._runTest = function(testFn) {
      try {
         testFn();
         this._result = TestResult.success(this._name);
      }
      catch(e) {
         this._result = TestResult.error(this._name, e);
      }

      this._next();
   };

   return AsyncTest;

}());

if(typeof module != 'undefined') {
   module.exports = AsyncTest;
}
