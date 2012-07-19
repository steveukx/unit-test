
function doAssertion(assertion, args) {
   var name = args.shift();
   try {
      assertion.apply(undefined, args);
   }
   catch(e) {
      console.error(name, e.toString());
      process.exit();
   }
}

function AssertionError(found, expected) {
   this.found = found;
   this.expected = expected;
   this.toString = function() {
      return 'Found ' + found + ' when should have found ' + expected;
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
         args.unshift('Call to ' + assertionName);
      }

      if(args.length !== argumentsLength + 1) {
         throw new AssertionCallError(assertionName, argumentsLength);
      }

      doAssertion(assertion, args);
   };
}

module.exports = {
   assert: makeAssertion('assert', 1, function(found) {
     if(found !== true) {
        throw new AssertionError(found, true);
     }
   }),

   assertExists: makeAssertion('assert exists', 1, function(found) {
      if(found === undefined) {
         throw new AssertionError(found, 'not undefined');
      }
   }),

   assertUndefined: makeAssertion('assert undefined', 1, function(found) {
      if(found !== undefined) {
         throw new AssertionError(found, undefined);
      }
   }),

   assertNull: makeAssertion('assert null', 1, function(found) {
      if(found !== null) {
         throw new AssertionError(found, null);
      }
   }),

   assertEquals: makeAssertion('assert equals', 2, function(found, expected) {
      if(found !== expected) {
         throw new AssertionError(found, expected);
      }
   })
};