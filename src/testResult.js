/**
 * @class
 */
var TestResult = (function () {

   "use strict";

   /**
    *
    * @constructor
    * @name TestResult
    */
   function TestResult(name, result) {
      this.name = name;
      this.result = result;
   }

   TestResult.prototype.setError = function(error) {
      this.error = error;
      return this;
   };

   TestResult.error = function(name, error) {
      return new TestResult(name, false).setError(error);
   };

   TestResult.success = function(name) {
      return new TestResult(name, true);
   };

   return TestResult;

}());

if(typeof module != 'undefined') {
   module.exports = TestResult;
}
