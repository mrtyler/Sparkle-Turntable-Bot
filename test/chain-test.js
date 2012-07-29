var buster = require("buster");
var myLib = require("../chain.js");

////
//// FITS
////

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

//
// Real world cases
//

// Don't blow up if track contains characters special to regex.
buster.testCase("trackFitsChain", {
    "track ()[]*?/ chain A Shot In The Arm false": function () {
        refute(global.trackFitsChain("()[]*?/", "A Shot In The Arm"));
    }
});

buster.testCase("trackFitsChain", {
    "track ()[]*?/ chain ()your mom() true": function () {
        assert(global.trackFitsChain("()[]*?/", "()your mom()"));
    }
});

buster.testCase("trackFitsChain", {
    "track Armistice chain A Shot In The Arm true": function () {
        assert(global.trackFitsChain("Armistice", "A Shot In The Arm"));
    }
});

//
// Ignore a, an, the
//
buster.testCase("trackFitsChain", {
    "track Shot Shot chain A Shot In The Arm true": function () {
        assert(global.trackFitsChain("Shot Shot", "A Shot In The Arm"));
    }
});

////
//// NORMALIZE
////
buster.testCase("normalize", {
    "track A Shot In The Arm returns Shot In Arm": function () {
        var track = "A Shot In The Arm";
        var expected = "Shot In Arm";
        var actual = global.normalize(track);
        assert.equals(actual, expected);
     }
});

buster.testCase("normalize", {
    "track The Bart The returns Bart": function () {
        var track = "The Bart The";
        var expected = "Bart";
        var actual = global.normalize(track);
        assert.equals(actual, expected);
     }
});

// :map T :!node test/chain-test.js<CR>
