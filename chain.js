// http://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
RegExp.quote = function(str) {
        return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

global.chain = '';
global.previous_chain = '';
global.chain_minimum_window = 2;

// Does track fit chain?
global.trackFitsChain = function (track, chain) {
    // When there is no chain, any track fits.
    if (!chain) {
        return true;
    }

    // When there is no chain or if the chain is less than the minimum
    // window size, any track fits.
    if (chain.length < global.chain_minimum_window) {
        return true;
    }

    //
    // Try to attach to the front
    //

    // Take the last n characters from track where n is the minimum
    // window size. Compare this with the beginning of the chain. If
    // they match, the track fits.
    window_size = global.chain_minimum_window;
    while (window_size <= track.length) {
        var normalized_track = global.normalize(track);
        var normalized_chain = global.normalize(chain);

        start_query = normalized_track.slice(-window_size);
        start_re = new RegExp('^' + RegExp.quote(start_query), 'i');
        end_query = normalized_track.slice(0, window_size);
        end_re = new RegExp(RegExp.quote(end_query) + '$', 'i');

        if (normalized_chain.match(start_re) || normalized_chain.match(end_re)) {
            return true;
        }
        window_size++;
    }

    // If we've reached the end and haven't found a match, the track
    // doesn't fit.
    return false;
}

// Clean up a track
global.normalize = function (track) {
    var return_me = track;
    return_me = return_me.replace(/(\s|^)(a|an|the)(\s|$)/gi, "$1$3");
    // Clean up whitespace
    return_me = return_me.trim();
    return_me = return_me.replace(/  +/g, " ");
    return return_me;
}
