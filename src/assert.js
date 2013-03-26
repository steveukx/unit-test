
function doAssertion(assertion, args) {
   assertion.apply(undefined, args);
}

function AssertionError(actual, expected, message) {
   this.name = 'AssertionError';
   this.message = message;
   this.actual = actual;
   this.expected = expected;
   this.toString = function() {
      return this.message ?
                  this.message + ' :: ' + actual :
                  'Found ' + actual + ' when should have found ' + expected;
   }
}

function AssertionCallError(assertionName, argumentsLength) {
   this.toString = function() {
      return 'Calls to ' + assertionName + ' require ' + argumentsLength + ' arguments';
   };
}

function makeAssertion(assertionName, argumentsLength, assertion) {
   return function() {
      var args = [].slice.call(arguments, 0);
      if(args.length === argumentsLength) {
         args.push('Call to ' + assertionName);
      }

      if(args.length !== argumentsLength + 1) {
         throw new AssertionCallError(assertionName, argumentsLength);
      }

      doAssertion(assertion, args);
      return Assertions;
   };
}

var Assertions = module.exports = {

   /**
    * Assert that the supplied actual is truthy (ie: not any of false, zero, undefined or null).
    *
    * @param {Boolean} actual
    * @param {String} [message]
    * @function
    */
   assert: makeAssertion('assert', 1, function(actual, message) {
      Assertions.assertEquals(!!actual, true, message);
   }),

   /**
    * Assert that the supplied actual is not undefined, equivalent to using
    * `assertNotEquals(actual, undefined, message);`.
    *
    * @param actual
    * @param {String} [message]
    * @function
    */
   assertExists: makeAssertion('assert exists', 1, function(actual, message) {
      Assertions.assertNotEquals(actual, undefined, message);
   }),

   /**
    * Assert that the supplied actual is undefined, equivalent to using `assertEquals(actual, undefined, message)`.
    *
    * @param actual
    * @param {String} [message]
    * @function
    */
   assertUndefined: makeAssertion('assert undefined', 1, function(actual, message) {
      Assertions.assertEquals(actual, undefined, message);
   }),

   /**
    * Assert that the supplied actual is null, equivalent to using `assertEquals(actual, null, message)`..
    *
    * @param actual
    * @param {String} [message]
    * @function
    */
   assertNull: makeAssertion('assert null', 1, function(actual, message) {
      Assertions.assertEquals(actual, null, message);
   }),

   /**
    * Assert that the supplied actual and expected values are the same, in the case of non-primitive data
    * types, they must also be the same reference as each other.
    *
    * @param actual
    * @param expected
    * @param {String} [message]
    * @function
    */
   assertEquals: makeAssertion('assert equals', 2, function(actual, expected, message) {
      if(actual !== expected) {
         throw new AssertionError(actual, expected, message);
      }
   }),

   /**
    * Assert that the supplied actual and expected values are not the same as each other, in the case of
    * non-primitive values, equivalent instances that are not the same reference will be treated as not the
    * same as each other.
    *
    * @param {Boolean} actual
    * @param {String} [message]
    * @function
    */
   assertNotEquals: makeAssertion('assert equals', 2, function(actual, expected, message) {
      if(actual === expected) {
         throw new AssertionError(actual, 'not ' + expected, message);
      }
   }),

   AssertionError: AssertionError
};
