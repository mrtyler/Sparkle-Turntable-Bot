// Node tests
var buster = require("buster");
var myLib = require("../chain.js");

buster.testCase("A module", {
    "states the obvious": function () {
        assert(true);
    }
});
