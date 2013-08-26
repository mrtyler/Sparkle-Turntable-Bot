var buster = require("buster");
var myLib = require("../chain.js");

////
//// CHAIN STATE MANAGEMENT
////

buster.testCase("chainStateManagement", {
    "setUp": function() {
        global._resetChain();
    },

    "get_set_Chain": function () {
        expected = "foo";
        global.setChain(expected);
        actual = global.getChain();
        assert.equals(actual, expected);
    },

    "empty chain has no history": function () {
        expected = "1 chain ago: ";
        actual = global.chainHistory(null);
        assert.equals(actual, expected);
    },

    "initial chain has no history": function () {
        global.setChain("initial");
        expected = "1 chain ago: ";
        actual = global.chainHistory(null);
        assert.equals(actual, expected);
    },

    "two chains has history no arg": function () {
        global.setChain("first");
        global.setChain("second");
        expected = "1 chain ago: first";
        actual = global.chainHistory(null);
        assert.equals(actual, expected);
    },

    "two chains has history 1": function () {
        global.setChain("first");
        global.setChain("second");
        expected = "1 chain ago: first";
        actual = global.chainHistory(1);
        assert.equals(actual, expected);
    },

    "two chains has no history 2": function () {
        global.setChain("first");
        global.setChain("second");
        expected = "History only goes back 1";
        actual = global.chainHistory(2);
        assert.equals(actual, expected);
    },

    "three chains has history 2 and history 1": function () {
        global.setChain("first");
        global.setChain("second");
        global.setChain("third");
        expected = "2 chains ago: first";
        actual = global.chainHistory(2);
        assert.equals(actual, expected);
    }
});

////
//// FITS
////
buster.testCase("trackFitsChain", {
    //
    // Base cases
    //
    "track anything chain empty true": function () {
        assert(global.trackFitsChain("anything", ""));
    },

    "track anything chain a true": function () {
        assert(global.trackFitsChain("anything", "a"));
    },

    "track ab chain ab true": function () {
        assert.equals(global.trackFitsChain("ab", "ab"), global.BEFORE_MATCH);
    },

    "track CaSe InSeNsItIVe chain case insensitive true": function () {
        assert(global.trackFitsChain("CaSe InSeNsItIVe", "case insensitive"));
    },

    //
    // Front of chain
    //
    "track ab chain abcd true": function () {
        assert(global.trackFitsChain("ab", "abcd"));
    },

    "track abc chain abcd true": function () {
        assert(global.trackFitsChain("abc", "abcd"));
    },

    //
    // Back of chain
    //
    "track cd chain abcd true": function () {
        assert(global.trackFitsChain("cd", "abcd"));
    },

    "track bcd chain abcd true": function () {
        assert(global.trackFitsChain("bcd", "abcd"));
    },

    //
    // Invalid connections
    //
    "track ab chain cd false": function () {
        refute(global.trackFitsChain("ab", "cd"));
    },

    "track bc chain abcd false": function () {
        refute(global.trackFitsChain("bc", "abcd"));
    },

    "track abcde chain bcd false": function () {
        refute(global.trackFitsChain("abcde", "bcd"));
    },

    //
    // Real world cases
    //

    // Don't blow up if track contains characters special to regex.
    "track ()[]*?/ chain A Shot In The Arm false": function () {
        refute(global.trackFitsChain("()[]*?/", "A Shot In The Arm"));
    },

    "track [][]*?/ chain []your mom[] true": function () {
        assert(global.trackFitsChain("[][]*?/", "[]your mom[]"));
    },

    "track Armistice chain A Shot In The Arm true": function () {
        assert(global.trackFitsChain("Armistice", "A Shot In The Arm"));
    },

    //
    // Ignore a, an, the
    //
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
     },

    "track The Bart The returns Bart": function () {
        var track = "The Bart The";
        var expected = "Bart";
        var actual = global.normalize(track);
        assert.equals(actual, expected);
     },

    "track People are Strange (Some Mix) returns People are Strange": function () {
        var track = "People are Strange (Some Mix)";
        var expected = "People are Strange";
        var actual = global.normalize(track);
        assert.equals(actual, expected);
     }
});

// :map T :!node test/chain-test.js<CR>
