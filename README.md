unit-test
=========

The unit-test module is a very light-weight unit test runner that was created simply to satisfy a need for something that did this job when I was in an internet-free zone. Feel free to fork and make improvements.

Currently you get:

    var UnitTest = require('unit-test'), // namespace entity
        TestSuite = UnitTest.Suite, // the test runner
        Assertions = UnitTest.Assertions; // selection of assertions to use in tests
    
    // run specifically named test files
    TestSuite.namedFiles('testA.js', 'testB.js');
    
    // find all matching test files and run those
    TestSutie.paths(__dirname__, 'tests/**.js');

Each test file loaded by the test suite should export an object that contains optional `setUp` and `tearDown` functions and any number of functions that begin with the word `test`. For example:

    var Assertions = require('unit-test').Assertions;
    
    module.exports = {
       'setUp':    function() { /* do something */ },
       'tearDown': function() { /* do something */ },
       
       'testCheck whether something is false': function() {
          Assertions.assertEquals(!1, false);
       },
       'testCheck whether something is false with a name': function() {
          Assertions.assertEquals("Checking something is false", !1, false);
       }
    };

For convenience, `unit-test` also includes `sinon` as `require('unit-test').Sinon`, Sinon (www.sinonjs.org) is a fantastic library for mocking, stubbing and spying on functions and objects in any unit test.

