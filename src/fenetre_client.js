const fenetre_client = {
  activeSockets: [],
  fenetre(socket, cb, error){
    socket.onclose = function(e){
      setTimeout(function(){
        error(e, socket);
      });
      this.removeSocket(socket.sid);
    }.bind(this);
    socket.onmessage = function(data){
      try {
        data = JSON.parse(data);
      } catch(e){
      }
      cb ? cb.call(socket, data) : (function(e){console.warn(`No callback to handle: ${e}`)})(data);
    };
  },
  connect(url, cb, error){
    var socket;
    try {
      socket = new WebSocket(url);
    } catch(e){
      var WebSocket = require('ws');
      socket = new WebSocket(url);
    }
    // var socket = WebSocket ? new WebSocket(url) : new require('ws');
    for(var i = 0; true; i++){
      if(!this.activeSockets[i]){
        this.activeSockets[i] = socket;
        socket.sid = i;
        break;
      }
    }
    this.fenetre(socket, cb, error);
    return socketSetUp(socket);
  },
  close(sid){
    activeSockets[sid].close();
  },
  removeSocket(sid){
    delete this.activeSockets[sid];
  }
};
function err(e){
  setTimeout(function(){
    error(e, socket);
  });
  this.removeSocket(socket.sid);
}
//This is so you can use the socket right away for writes and not wait for the open event
function socketSetUp(socket){
  var returnSocket = {
    opened: false,
    send(data){
      if(this.opened) socket.send(data);
      else this.queue.push(data);
    },
    onopen(){
      this.opened = true;
      this.queue.forEach((data)=>{
        this.socket.send(data);
      })
      this.queue = [];
    },
    socket: socket,
    queue: []
  }
  socket.onopen = returnSocket.onopen.bind(returnSocket);
  return returnSocket;
}

export default fenetre_client;
