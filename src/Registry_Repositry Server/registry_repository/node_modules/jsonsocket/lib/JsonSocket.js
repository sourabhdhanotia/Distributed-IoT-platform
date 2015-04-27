var net = require('net');
var util = require('util');
var events = require('events');
var log = require('debug')('JsonSocket:connection');
var dataLog = require('debug')('JsonSocket:data');

var version = require('../package.json').version;

function JsonSocket() {
    var socket = this;
    var connection = null;
    var json = "";

    if (arguments[0] instanceof net.Socket) {
        log('connect');
        connection =arguments[0];
    } else {
        connection = net.connect.apply(net, arguments);
    }

    connection.on('connect', function () {
        log('connect');
        socket.emit('connect');
    });

    connection.on('data', function (data) {
        var str = data.toString();
        var parts = str.split('\0');
        json += parts.shift();
        while (parts.length > 0) {
            dataLog('receive %s', json);
            socket.emit('json', JSON.parse(json));
            json = parts.shift();
        }
    });

    connection.on('end', function () {
        log('disconnect');
        socket.emit('disconnect');
    });

    connection.on('error', function (ex) {
        log(ex);
        socket.emit('error', ex);
    });

    socket.write = function (data) {
        dataLog('write %s', JSON.stringify(data));
        connection.write(JSON.stringify(data) + '\0');
    };

    socket.disconnect = function () {
        connection.destroy();
    };

    socket.connect = function () {
        connection.connect.apply(connection, arguments);
    };
}

util.inherits(JsonSocket, events.EventEmitter);

module.exports = JsonSocket;
module.exports.version = version;