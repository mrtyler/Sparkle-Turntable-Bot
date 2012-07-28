exports.name = 'setchain';
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    setTimeout(function() {
        global.chain = data.text.substring(exports.name.length + 1);
        var response = ('Chain set to:' + global.chain);
        output({text: response, destination: data.source, userid: data.userid});
    }, 600);
}
