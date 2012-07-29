exports.name = 'chain';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    setTimeout(function() {
        var subcommand = data.text.substring(exports.name.length + 1);
        var reply = 'default (should never be displayed)';

        if (/^set /.test(subcommand)) {
            global.chain = subcommand.substring('set '.length);
            reply = 'Setting chain to: ' + global.chain;
        } else if(/^before /.test(subcommand)) {
            global.chain = subcommand.substring('before '.length) + ' ' + global.chain;
            reply = 'Prepended. Chain is now: ' + global.chain;
        } else if(/^after /.test(subcommand)) {
            global.chain = global.chain + ' ' + subcommand.substring('after '.length);
            reply = 'Appended. Chain is now: ' + global.chain;
        } else {
            reply = 'Current chain: ' + global.chain;
        }

        output({text: reply, destination: data.source, userid: data.userid});
    }, 600);
}
