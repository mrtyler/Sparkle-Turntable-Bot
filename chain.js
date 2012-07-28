global.chain = '';
global.chain_minimum_window = 2;

//DB: Does track fit chain?
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
        start_query = track.slice(-window_size);
        start_re = new RegExp('^' + start_query, 'i');
        end_query = track.slice(0, window_size);
        end_re = new RegExp(end_query + '$', 'i');

        if (chain.match(start_re) || chain.match(end_re)) {
            return true;
        }
        window_size++;
    }

    // If we've reached the end and haven't found a match, the track
    // doesn't fit.
    return false;
}
