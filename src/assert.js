
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
   assert: makeAssertion('assert', 1, function(actual, message) {
      Assertions.assertEquals(!!actual, true, message);
   }),

   assertExists: makeAssertion('assert exists', 1, function(actual, message) {
      Assertions.assertNotEquals(actual, undefined, message);
   }),

   assertUndefined: makeAssertion('assert undefined', 1, function(actual, message) {
      Assertions.assertEquals(actual, undefined, message);
   }),

   assertNull: makeAssertion('assert null', 1, function(actual, message) {
      Assertions.assertEquals(actual, null, message);
   }),

   assertEquals: makeAssertion('assert equals', 2, function(actual, expected, message) {
      if(actual !== expected) {
         throw new AssertionError(actual, expected, message);
      }
   }),

   assertNotEquals: makeAssertion('assert equals', 2, function(actual, expected, message) {
      if(actual === expected) {
         throw new AssertionError(actual, 'not ' + expected, message);
      }
   }),

   AssertionError: AssertionError
};