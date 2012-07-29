exports.name = 'chain';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    setTimeout(function() {
        var subcommand = data.text.substring(exports.name.length + 1);
        var reply = 'default (should never be displayed)';

        if (/^set /.test(subcommand)) {
            global.previous_chain = global.chain;
            global.chain = subcommand.substring('set '.length);
            reply = 'Set chain to: ' + global.chain;
        } else if(/^revert/.test(subcommand)) {
            var replaced = global.chain;
            global.chain = global.previous_chain;
            global.previous_chain = replaced;
            reply = 'Revert chain to: ' + global.chain;
        } else if(/^before/.test(subcommand)) {
            global.previous_chain = global.chain;
            global.chain = (currentsong.song || '') + ' ' + global.chain;
            reply = 'Before. Chain is now: ' + global.chain;
        } else if(/^after/.test(subcommand)) {
            global.previous_chain = global.chain;
            global.chain = global.chain + ' ' + (currentsong.song || '');
            reply = 'After. Chain is now: ' + global.chain;
        } else if(/^prepend /.test(subcommand)) {
            global.previous_chain = global.chain;
            global.chain = subcommand.substring('prepend '.length) + ' ' + global.chain;
            reply = 'Prepend. Chain is now: ' + global.chain;
        } else if(/^append /.test(subcommand)) {
            global.previous_chain = global.chain;
            global.chain = global.chain + ' ' + subcommand.substring('append '.length);
            reply = 'Append. Chain is now: ' + global.chain;
        } else {
            reply = 'Current chain: ' + global.chain;
        }

        output({text: reply, destination: data.source, userid: data.userid});
    }, 600);
}
