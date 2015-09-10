"use strict";

var fenetre_client = {
  activeSockets: [],
  fenetre: function fenetre(socket, cb, error) {
    socket.onclose = (function (e) {
      setTimeout(function () {
        error(e, socket);
      });
      this.removeSocket(socket.sid);
    }).bind(this);
    socket.onmessage = function (data) {
      try {
        data = JSON.parse(data);
      } catch (e) {}
      cb ? cb.call(socket, data) : (function (e) {
        console.warn("No callback to handle: " + e);
      })(data);
    };
  },
  connect: function connect(url, cb, error) {
    var socket;
    try {
      socket = new WebSocket(url);
    } catch (e) {
      var WebSocket = require("ws");
      socket = new WebSocket(url);
    }
    // var socket = WebSocket ? new WebSocket(url) : new require('ws');
    for (var i = 0; true; i++) {
      if (!this.activeSockets[i]) {
        this.activeSockets[i] = socket;
        socket.sid = i;
        break;
      }
    }
    this.fenetre(socket, cb, error);
    return socketSetUp(socket);
  },
  close: function close(sid) {
    activeSockets[sid].close();
  },
  removeSocket: function removeSocket(sid) {
    delete this.activeSockets[sid];
  }
};
function err(e) {
  setTimeout(function () {
    error(e, socket);
  });
  this.removeSocket(socket.sid);
}
//This is so you can use the socket right away for writes and not wait for the open event
function socketSetUp(socket) {
  var returnSocket = {
    opened: false,
    send: function send(data) {
      if (this.opened) socket.send(data);else this.queue.push(data);
    },
    onopen: function onopen() {
      var _this = this;

      this.opened = true;
      this.queue.forEach(function (data) {
        _this.socket.send(data);
      });
      this.queue = [];
    },
    socket: socket,
    queue: []
  };
  socket.onopen = returnSocket.onopen.bind(returnSocket);
  return returnSocket;
}

module.exports = fenetre_client;