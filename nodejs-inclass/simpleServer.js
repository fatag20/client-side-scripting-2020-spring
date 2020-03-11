const http = require("http");

function allowAnyOrigin(res)
{
    res.setHeader("Access-Control-Allow-Origin", "*");
}

let numberOfRequests = 0;

http.createServer(( req, res ) => {
    allowAnyOrigin(res);
    res.write(`Good morning Sam #${++numberOfRequests}!!!!`);
    res.end();
}).listen(8080);