exports.name = 'chain';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    setTimeout(function() {
        var response = ('Current chain:' + global.chain);
        output({text: response, destination: data.source, userid: data.userid});
    }, 600);
}
