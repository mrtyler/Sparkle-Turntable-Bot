exports.name = 'chain';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    setTimeout(function() {
        var subcommand = data.text.substring(exports.name.length + 1);
        var reply = 'default (should never be displayed)';

        if (/^set /.test(subcommand)) {
            global.setChain(subcommand.substring('set '.length));
            reply = 'Set chain to: ' + global.getChain();
        } else if(/^undo/.test(subcommand)) {
            global.undoChain();
            reply = 'Revert chain to: ' + global.getChain();
        } else if(/^before/.test(subcommand)) {
            global.prependChain(currentsong.song || '');
            reply = 'Before. Chain is now: ' + global.getChain();
        } else if(/^after/.test(subcommand)) {
            global.appendChain(currentsong.song || '');
            reply = 'After. Chain is now: ' + global.getChain();
        } else if(/^prepend /.test(subcommand)) {
            global.prependChain(subcommand.substring('prepend '.length));
            reply = 'Prepend. Chain is now: ' + global.getChain();
        } else if(/^append /.test(subcommand)) {
            global.appendChain(subcommand.substring('append '.length));
            reply = 'Append. Chain is now: ' + global.getChain();
        } else {
            reply = 'Current chain: ' + global.getChain();
        }

        output({text: reply, destination: data.source, userid: data.userid});
    }, 600);
}
