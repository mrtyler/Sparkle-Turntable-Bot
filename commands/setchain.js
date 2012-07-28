exports.name = 'setchain';
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    global.chain = data.text.substring(exports.name.length + 1);
    var response = ('Chain set to:' + global.chain);
    output({text: response, destination: data.source, userid: data.userid});
//    setTimeout(function() {
//        var response = (config.responses.rules.description);
//        output({text: response, destination: data.source, userid: data.userid});
//    }, 600);
}
