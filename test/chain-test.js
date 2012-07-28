var buster = require("buster");
var myLib = require("../chain.js");

buster.testCase("trackFitsChain", {
    "is trivially true": function () {
        assert(global.trackFitsChain("test_track", "test_chain"));
    }
});

// :map T :!node test/chain-test.js<CR>
