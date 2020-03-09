const http = require("http");

let greetingsCount = 0;

http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); //complicated and confusing, but allows our "frontend" which is served from a different "origin", to access the response here
    res.write(`Hello World #${++greetingsCount}!`); //write a response to the client
    res.end(); //end the response
  }).listen(8080); //the server object listens on port 8080