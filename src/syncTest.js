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
    * Start running the test, the supplied callback will be called with a TestResult
    *
    * @param {Function} resultCallback
    */
   SyncTest.prototype.run = function(resultCallback) {
      var result;

      try {
         this._test();
         result = TestResult.success(this._name);
      }
      catch(e) {
         result = TestResult.error(this._name, e);
      }
      resultCallback(result);
   };

   return SyncTest;

}());

if(typeof module != 'undefined') {
   module.exports = SyncTest;
}
