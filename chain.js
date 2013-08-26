// http://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
RegExp.quote = function(str) {
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

global.chain = ''
global.previous_chain = '';
global.chain_minimum_window = 2;

global.AFTER_MATCH = "after";
global.BEFORE_MATCH = "before";
global.MAX_UNDO = 100

////
//// CHAIN STATE MANAGEMENT
////
//
// getter
global.getChain = function () {
    return global.chain;
}

// setter
global.setChain = function (chain) {
    global.previous_chain = global.chain;
    global.chain = chain;
}

// reset
// destroys history. mostly useful for testing.
global._resetChain = function () {
    global.chain = '';
    global.previous_chain = '';
}

// revert
global.revertChain = function () {
    var replaced = global.chain;
    global.chain = global.previous_chain;
    global.previous_chain = replaced;
    return global.chain;
}
// history
global.chainHistory = function(ii) {
    if (ii == null) {
        ii = 1;
    }
    if (ii == 1) {
        chain_string = "chain";
    } else {
        chain_string = "chains";
    }
    return ii + " " + chain_string + " ago: " + global.previous_chain;
}

// prepend
global.prependChain = function (s) {
    global.setChain(s + ' ' + global.getChain());
}

// append
global.appendChain = function (s) {
    global.setChain(global.chain + ' ' + s); 
}


// Does track fit chain?
global.trackFitsChain = function (track, chain) {
    // When there is no chain, any track fits.
    if (!chain) {
        return true;
    }

    // If the chain is less than the minimum window size, any track
    // fits.
    if (chain.length < global.chain_minimum_window) {
        return true;
    }

    // Take the last n characters from track where n is at least the
    // minimum window size. Compare this with the beginning of the
    // chain. If they match, the track fits.
    window_size = track.length;
    while (window_size > 0) {
        var normalized_track = global.normalize(track);
        var normalized_chain = global.normalize(chain);

        start_query = normalized_track.slice(-window_size);
        start_re = new RegExp('^' + RegExp.quote(start_query), 'i');
        end_query = normalized_track.slice(0, window_size);
        end_re = new RegExp(RegExp.quote(end_query) + '$', 'i');

        if (normalized_chain.match(start_re)) {
            return global.BEFORE_MATCH;
        } else if (normalized_chain.match(end_re)) {
            return global.AFTER_MATCH;
        }
        window_size--;
    }

    // If we've reached the end and haven't found a match, the track
    // doesn't fit.
    return false;
}

// Clean up a track
global.normalize = function (track) {
    var return_me = track;

    // Remove filler words
    return_me = return_me.replace(/(\s|^)(a|an|and|the)(\s|$)/gi, "$1$3");
    // Remove parens. This is a little dramatic since subtitles (e.g.
    // "Dude (Looks Like A Lady)") are legit. Most stuff on Turntable
    // seems to be of the "(some remix)" variety, which we don't want to
    // use for chaining.
    return_me = return_me.replace(/\(.*\)/gi, "");

    // Clean up whitespace
    // Leave this last so it can clean up any extra spaces left behind
    // by previous cleanups.
    return_me = return_me.trim();
    return_me = return_me.replace(/  +/g, " ");

    // Return
    return return_me;
}
