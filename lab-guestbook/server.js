/* This code is, sadly, very verbose because I am afraid we might
    not be able to use any node packages in class before spring break...
    That is why I am not making you write it (-: You are free to look
    at it and please ask questions!
    If you find any bugs (there are probably many), you will get an <unknown prize>
*/

const http = require("http");

const port = 9000;
let guestbook = [];

function allowAnyOrigin(res)
{
    res.setHeader("Access-Control-Allow-Origin", "*");
}

function sanitizeUrl(url)
{
    return url.toLowerCase().replace(/^\/+|\/+$/g, '');
}

function toResourceRequest(req)
{
    const sanitizedUrl = sanitizeUrl(req.url);
    const firstSlashIndex = sanitizedUrl.indexOf("/");

    if (firstSlashIndex === -1 || firstSlashIndex === sanitizedUrl.length)
        return { type: "unknown" };
    
    const resourceType = sanitizedUrl.substr(0, firstSlashIndex);

    if (resourceType !== "api")
        return { type: "unknown" };

    const resourceName = sanitizedUrl.substr(firstSlashIndex + 1);

    if (resourceName.length === 0)
        return { type: "unknown" };

    return { type: resourceType, name: resourceName, request: req };
}

function useJsonContentHeader(res)
{
    res.setHeader('Content-Type', 'application/json');
}

function handleAddMessage(messageObject, res)
{
    if ("author" in messageObject && "text" in messageObject)
    {
        const newMessage = { author: messageObject.author, text: messageObject.text };
        guestbook.push(newMessage);
        useJsonContentHeader(res);
        res.write(JSON.stringify(newMessage));
    }
    else
    {
        res.writeHead(400);
        res.write("A message must be an object with `author` and `text`");
    }
}

async function handleApiResourceRequest(apiResourceRequest, res)
{
    if (apiResourceRequest.name === "message" && apiResourceRequest.request.method === "POST")
    {
        const messageObject = await readBodyAsJson(apiResourceRequest.request);    
        handleAddMessage(messageObject, res);
    }
    else if (apiResourceRequest.name === "messages" && apiResourceRequest.request.method === "GET")
    {
        useJsonContentHeader(res);
        res.write(JSON.stringify(guestbook));
    }
    else
    {
        res.statusCode = 404;
    }
}

async function handleResourceRequest(resourceRequest, res)
{
    switch (resourceRequest.type)
    {
        case "unknown":
            res.statusCode = 404;
            break;
        case "api":
            await handleApiResourceRequest(resourceRequest, res);
            break;
        default:
            console.error(`Got unsupported resource request type: ${resourceRequest.type}`)
            res.statusCode = 500;
            break;
    }
}

function toReadableRequest(req)
{
    return `Request(${req.method} ${req.url})`;
}

function toReadableResponse(res)
{
    return `Response(${res.statusCode})`;
}

function readBodyAsString(request)
{
    return new Promise(resolve => {
        let buffer = [];
        request.on('data', (chunk) => {
            buffer.push(chunk);
        }).on('end', () => {
            const bodyAsString = Buffer.concat(buffer).toString();
            resolve(bodyAsString);
        });
    });
}

function readBodyAsJson(request)
{
    return readBodyAsString(request)
        .then(bodyAsString => JSON.parse(bodyAsString));
}

http.createServer(async (req, res) => {
    try
    {
        allowAnyOrigin(res); // Feels bad
        const resourceRequest = toResourceRequest(req);
        await handleResourceRequest(resourceRequest, res);
    }
    catch (error)
    {
        console.error(`Unhandled error while handling ${toReadableRequest(req)}: ${error}`);
        res.writeHead(500); // Need to research difference between statusCode = and writeHead()...
    }
    res.end();
    console.log(`Responded to ${toReadableRequest(req)} with ${toReadableResponse(res)}`); // Sometimes reports incorrect stuff...
}).listen(port);

console.log(`Started on port ${port}`);