// http://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
RegExp.quote = function(str) {
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

global.CHAIN_MINIMUM_WINDOW = 2;

global.AFTER_MATCH = "after";
global.BEFORE_MATCH = "before";

// reset
// destroys history. mostly useful for initialization and testing.
global._resetChain = function () {
    global.chain = [''];
    global.chain_idx = 0;
    global.MAX_HISTORY = 100;
}
global._resetChain();

////
//// CHAIN STATE MANAGEMENT
////
//
// getter
global.getChain = function () {
    return global.chain[global.chain_idx];
}

// setter
global.setChain = function (chain) {
    global.chain_idx = global.chain_idx + 1;
    global.chain[global.chain_idx % global.MAX_HISTORY] = chain;
}

// undo
global.undoChain = function () {
    global.chain_idx = global.chain_idx - 1;
    if (global.chain_idx < 0) {
        global.chain_idx = 0;
    }
    return global.getChain();
}

// redo
global.redoChain = function () {
    global.chain_idx = global.chain_idx + 1;
    // ### some safety check
    return global.getChain();
}

// history
global.chainHistory = function(ii) {
    // default
    if (ii == null) {
        ii = 1;
    }

    if (ii > global.MAX_HISTORY || ii > global.chain_idx) {
        return "History only goes back " + Math.min(global.MAX_HISTORY, global.chain_idx) + " chains";
    }
    var historical_chain_idx = global.chain_idx - ii;
    if (historical_chain_idx < 0) {
        historical_chain_idx = historical_chain_idx + global.MAX_HISTORY;
    }

    if (ii == 1) {
        chain_or_chains = "chain";
    } else {
        chain_or_chains = "chains";
    }

    return ii + " " + chain_or_chains + " ago: " + global.chain[historical_chain_idx];
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
    if (chain.length < global.CHAIN_MINIMUM_WINDOW) {
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
