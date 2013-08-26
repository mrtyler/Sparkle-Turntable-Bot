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
        actual = global.chainHistory(null);
        expected = "History only goes back 0 chains";
        assert.equals(actual, expected);
    },

    "initial chain has no history": function () {
        global.setChain("initial");
        actual = global.chainHistory(null);
        expected = "1 chain ago: ";
        assert.equals(actual, expected);
    },

    "two chains has history no arg": function () {
        global.setChain("first");
        global.setChain("second");
        actual = global.chainHistory(null);
        expected = "1 chain ago: first";
        assert.equals(actual, expected);
    },

    "two chains has history 1": function () {
        global.setChain("first");
        global.setChain("second");
        actual = global.chainHistory(1);
        expected = "1 chain ago: first";
        assert.equals(actual, expected);
    },

    "two chains has empty history 2": function () {
        global.setChain("first");
        global.setChain("second");
        actual = global.chainHistory(2);
        expected = "2 chains ago: ";
        assert.equals(actual, expected);
    },

    "MAX_HISTORY 1 no chains history 2 fails": function () {
        var max_history_saved = global.MAX_HISTORY;
        global.MAX_HISTORY = 1
        actual = global.chainHistory(2);
        expected = "History only goes back 0 chains";
        assert.equals(actual, expected);
        global.MAX_HISTORY = max_history_saved;
    },

    "MAX_HISTORY 1 one chain history 2 fails": function () {
        var max_history_saved = global.MAX_HISTORY;
        global.MAX_HISTORY = 1

        global.setChain("first");
        actual = global.chainHistory(2);
        expected = "History only goes back 1 chains";
        assert.equals(actual, expected);

        global.MAX_HISTORY = max_history_saved;
    },

    "three chains has history 2 and history 1": function () {
        global.setChain("first");
        global.setChain("second");
        global.setChain("third");

        actual = global.chainHistory(2);
        expected = "2 chains ago: first";
        assert.equals(actual, expected);

        actual = global.chainHistory(1);
        expected = "1 chain ago: second";
        assert.equals(actual, expected);
    },

    "undo empty chain": function() {
        actual = global.undoChain();
        expected = "";
        assert.equals(actual, expected);
    },

    "undo 1 chain": function() {
        global.setChain("first");
        actual = global.undoChain();
        expected = "";
        assert.equals(actual, expected);

        // base case
        actual = global.undoChain();
        expected = "";
        assert.equals(actual, expected);
    },

    "undo 2 chain": function() {
        global.setChain("first");
        global.setChain("second");

        actual = global.undoChain();
        expected = "first";
        assert.equals(actual, expected);

        actual = global.undoChain();
        expected = "";
        assert.equals(actual, expected);
    },

    "undo 3 chain": function() {
        global.setChain("first");
        global.setChain("second");
        global.setChain("third");

        actual = global.undoChain();
        expected = "second";
        assert.equals(actual, expected);

        actual = global.undoChain();
        expected = "first";
        assert.equals(actual, expected);

        actual = global.undoChain();
        expected = "";
        assert.equals(actual, expected);
    }

//    "undo 3 chain max 2": function() {
//        var max_history_saved = global.MAX_HISTORY;
//        global.MAX_HISTORY = 2;
//
//        global.setChain("first");
//        global.setChain("second");
//        global.setChain("third");
//
//        actual = global.undoChain();
//        expected = "second";
//        assert.equals(actual, expected);
//
//        actual = global.undoChain();
//        expected = "";
//        assert.equals(actual, expected);
//
//        global.MAX_HISTORY = max_history_saved;
//    }
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
