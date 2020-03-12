const http = require("http");

const port = 8080;

function allowAnyOrigin(res)
{
    res.setHeader("Access-Control-Allow-Origin", "*");
}

function toReadableRequest(req)
{
    return `Request(${req.method} ${req.url})`;
}

let numberOfRequests = 0;

http.createServer(( req, res ) => {
    allowAnyOrigin(res);
    console.log(`Handling ${toReadableRequest(req)}`);

    if (req.url !== "/")
    {
        res.writeHead(404);
    }
    else
    {
        res.write(`Good morning Sam #${++numberOfRequests}!!!!`);
    }
    
    res.end();
}).listen(port);

console.log(`Running on port ${port}`);