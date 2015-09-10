process.env.NODE_ENV = "test";

import fenetre_client from './../src/fenetre_client.js';
import should from 'should';
import WebSocket from 'ws';
import fenetre from 'fenetre';

fenetre.init(new WebSocket.Server({port: 8335}));

describe("fenetre_client", function(){
  it("Should run first callback when receiving data", function(done){
    fenetre.at("/test", function(){
      this.send("Test Back");
    })
    fenetre_client.connect('ws://localhost:8335/test', function(){
      done();
    }, function(){
      throw new Error("Ran error callback, for a valid route.");
    })
  })
  it("Should be able to send data immediately", function(done){
    fenetre.at("/send-test", null, function(data){
      done();
    })
    fenetre_client.connect("ws://localhost:8335/send-test").send("Me Oh My");
  })
});
