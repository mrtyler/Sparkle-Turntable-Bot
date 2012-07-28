exports.name = 'reset';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    global.chain = '';
    var response = ('Chain is reset! Current chain:' + global.chain);
    output({text: response, destination: data.source, userid: data.userid});
//    setTimeout(function() {
//        var response = (config.responses.rules.description);
//        output({text: response, destination: data.source, userid: data.userid});
//    }, 600);
}
