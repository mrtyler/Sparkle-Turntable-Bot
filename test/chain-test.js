var buster = require("buster");
var myLib = require("../chain.js");

//
// Base cases
//
buster.testCase("trackFitsChain", {
    "track anything chain empty true": function () {
        assert(global.trackFitsChain("anything", ""));
    }
});

buster.testCase("trackFitsChain", {
    "track anything chain a true": function () {
        assert(global.trackFitsChain("anything", "a"));
    }
});

buster.testCase("trackFitsChain", {
    "track ab chain ab true": function () {
        assert(global.trackFitsChain("ab", "ab"));
    }
});

buster.testCase("trackFitsChain", {
    "track CaSe InSeNsItIVe chain case insensitive true": function () {
        assert(global.trackFitsChain("CaSe InSeNsItIVe", "case insensitive"));
    }
});

//
// Front of chain
//
buster.testCase("trackFitsChain", {
    "track ab chain abcd true": function () {
        assert(global.trackFitsChain("ab", "abcd"));
    }
});

buster.testCase("trackFitsChain", {
    "track abc chain abcd true": function () {
        assert(global.trackFitsChain("abc", "abcd"));
    }
});

//
// Back of chain
//
buster.testCase("trackFitsChain", {
    "track cd chain abcd true": function () {
        assert(global.trackFitsChain("cd", "abcd"));
    }
});

buster.testCase("trackFitsChain", {
    "track bcd chain abcd true": function () {
        assert(global.trackFitsChain("bcd", "abcd"));
    }
});

//
// Invalid connections
//
buster.testCase("trackFitsChain", {
    "track ab chain cd false": function () {
        refute(global.trackFitsChain("ab", "cd"));
    }
});

buster.testCase("trackFitsChain", {
    "track bc chain abcd false": function () {
        refute(global.trackFitsChain("bc", "abcd"));
    }
});

buster.testCase("trackFitsChain", {
    "track abcde chain bcd false": function () {
        refute(global.trackFitsChain("abcde", "bcd"));
    }
});

// Real world cases
buster.testCase("trackFitsChain", {
    "track Armistice chain A Shot In The Arm true": function () {
        assert(global.trackFitsChain("Armistice", "A Shot In The Arm"));
    }
});

/*
//
// Ignore a, an, the
//
buster.testCase("trackFitsChain", {
    "track Shot Shot chain A Shot In The Arm true": function () {
        assert(global.trackFitsChain("Shot Shot", "A Shot In The Arm"));
    }
});
*/

// :map T :!node test/chain-test.js<CR>
