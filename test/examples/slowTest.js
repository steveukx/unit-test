
var alreadyRunning = false;

module.exports = {
    'test something slowly': function (next) {
        var wasError = false;
        if (alreadyRunning) {
            wasError = true;
        }
        alreadyRunning = true;

        setTimeout(function () {
            alreadyRunning = false;
            next(wasError ? new Error("Called when a test was already running") : null);
        }, 10);
    }
};

